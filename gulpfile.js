const path = require('path')
const fs = require('fs')
const { spawn } = require('child-process-promise')

const gulp = require('gulp')
const sass = require('gulp-sass')
const postcss = require('gulp-postcss')
const plumber = require('gulp-plumber')
const rev = require('gulp-rev')
const replace = require('gulp-replace')
const htmlmin = require('gulp-htmlmin')
const cheerio = require('gulp-cheerio')
const inlinesource = require('gulp-inline-source')

const mjAPI = require('mathjax-node')
const globby = require('globby')
const moduleImporter = require('sass-module-importer')
const runSequence = require('run-sequence')
const del = require('del')
const autoprefixer = require('autoprefixer')
const cssNano = require('cssnano')
const escape = require('escape-string-regexp')

mjAPI.config({ MathJax: {
  TeX: {
    equationNumbers: {
      autoNumber: "AMS"
    },
    Macros: {
      edge: '\\mathrel{-}',
      notedge: '\\not\\edge',
      deg: ['#1^°', 1],
      tbold: ['\\textbf{#1}', 1],
      mbold: ['\\mathbf{#1}', 1],
      unit: ['\\widehat{\\mathbf{#1}}', 1],

      v: ['\\overrightarrow{#1}', 1],
      vnorm: ['\\norm{\\v{#1}}', 1],

      magnitude: ['\\left \\| #1 \\right \\|', 1],
      norm: ['\\lvert #1 \\rvert', 1],
      divides: ['\\,|\\,']
    }
  },
} })
mjAPI.start()

function execCommand (args) {
  // iterate over every package and execute the command described above
  const cmd = args[0]
  args.shift()
  return globby('packages/browser-*/', { mark: true })
    .then(dirs => {
      return Promise.all(
        dirs
          .filter(dir => {
            const pkg = require(path.join(__dirname, dir, 'package.json'))
            return !pkg.skip
          })
          .map(dir => (
            spawn(cmd, args, {
              cwd: path.join(process.cwd(), dir),
              stdio: 'inherit'
            })
          ))
      )
    })
}

gulp.task('clean', function () {
  return del([
    'public'
  ])
})

gulp.task('css', function () {
  const processors = [
    autoprefixer,
    cssNano
  ]
  return gulp.src('./themes/blank/_compile/sass/*.scss')
    .pipe(plumber())
    .pipe(sass({ importer: moduleImporter() }))
    .pipe(postcss(processors))
    .pipe(gulp.dest('./themes/blank/static/css'))
})

gulp.task('build:data', () => {
  return spawn('node', ['scripts/flatten-render-tree.js'], { stdio: 'inherit' })
})

gulp.task('build:packages', () => {
  return Promise.resolve()
    .then(() => spawn('./node_modules/.bin/lerna', ['bootstrap'], { stdio: 'inherit' }))
    .then(() => execCommand(['npm', 'install']))
    .then(() => execCommand(['npm', 'run', 'build', '--', '-p']))
})

gulp.task('build:hugo', () => {
  return spawn('hugo', { stdio: 'inherit' })
})

gulp.task('build:mathjax', () => {
  return gulp.src('public/**/*.html')
    .pipe(cheerio({
      run: function ($, file, done) {
        const p = []
        $('span.math')
        .filter(i => i <= 10)
        .each(function () {
          const $el = $(this)
          const len = $el.text().length
          // console.log($el.text().substring(2, len - 2))
          const promise = mjAPI.typeset({
            math: $el.text().substring(2, len - 2).trim(),
            svg: true
          })
            .then(data => $el.html(data.svg))
            .catch(err => {
              console.log(file.toString())
              console.log($('title').text())
              console.error(err)
              throw err
            })
          p.push(promise)
        })
        Promise.all(p)
          .then(() => done(), done)
      }
    }))
    .pipe(gulp.dest('public'))
})

gulp.task('build:html-minify', () => {
  return gulp.src('public/**/*.html')
    .pipe(inlinesource({
      compress: true,
      rootpath: path.resolve(path.join(__dirname, 'public/'))
    }))
    .pipe(htmlmin({
      collapseWhitespace: true,
      collapseBooleanAttributes: true,
      decodeEntities: true,
      processConditionalComments: true,
      removeAttributeQuotes: true,
      removeComments: true,
      removeEmptyAttributes: true,
      removeOptionalTags: true,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      removeTagWhitespace: true,
      trimCustomFragments: true,
      sortAttributes: true,
      sortClassName: true,
      useShortDoctype: true,

      // collapseInlineTagWhitespace: true,
      // fragments like \[ anything \]
      ignoreCustomFragments: [/<%[\s\S]*?%>/, /<\?[\s\S]*?\?>/, /\\\[[\s\S]*?\\\]/, /\\\([\s\S]*?\\\)/],
      minifyJS: true,
      minifyCSS: true
    }))
    .pipe(gulp.dest('public'))
})

gulp.task('watch', () => {
  gulp.watch('./themes/blank/_compile/sass/**', [ 'css' ])
})

gulp.task('revision:rev', () => {
  return gulp.src(['public/**/*.{js,css}'])
    .pipe(gulp.dest('public/'))
    .pipe(rev())
    .pipe(gulp.dest('public/'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('public/'))
})

gulp.task('revision:rev-replace', () => {
  let manifestFile = fs.readFileSync(path.join(__dirname, 'public/rev-manifest.json'), { encoding: 'utf-8' })
  const manifest = JSON.parse(manifestFile)
  const cat = Object.keys(manifest)
    .reduce((old, key) => `${old}|(${escape(key)})`, '@@@@@')
  const re = new RegExp(cat, 'g')
  return gulp.src('public/**/*.html')
    .pipe(replace(re, match => manifest[match]))
    .pipe(gulp.dest('public'))
})

gulp.task('revision', done => {
  return runSequence(
    'revision:rev',
    'revision:rev-replace',
    done
  )
})

gulp.task('build', function (done) {
  return runSequence(
    'clean',
    'css',
    'build:data',
    'build:packages',
    'build:hugo',
    // 'build:mathjax',
    'build:html-minify',
    'revision',
    done
  )
})

gulp.task('default', ['watch'])
