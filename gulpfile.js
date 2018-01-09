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
const inlinesource = require('gulp-inline-source')

const globby = require('globby')
const moduleImporter = require('sass-module-importer')
const runSequence = require('run-sequence')
const del = require('del')
const autoprefixer = require('autoprefixer')
const cssNano = require('cssnano')
const escape = require('escape-string-regexp')

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
            if (pkg.skip) {
              console.log(`skipping package ${path.join(__dirname, dir)}`)
            }
            return !pkg.skip
          })
          .map(dir => {
            const env = Object.create(process.env)
            return spawn(cmd, args, {
              cwd: path.join(process.cwd(), dir),
              stdio: 'inherit',
              env
            })
          })
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
  return gulp.src('./sass/*.scss')
    .pipe(plumber())
    .pipe(sass({ importer: moduleImporter() }))
    .pipe(postcss(processors))
    .pipe(gulp.dest('./static/css'))
})

gulp.task('build:packages', () => {
  return Promise.resolve()
    .then(() => spawn('./node_modules/.bin/lerna', ['bootstrap'], { stdio: 'inherit' }))
    .then(() => execCommand(['npm', 'install']))
    .then(() => execCommand(['npm', 'run', 'build']))
})

gulp.task('build:hugo', () => {
  return spawn('hugo', { stdio: 'inherit' })
})

gulp.task('build:html-minify', () => {
  return gulp.src('public/**/*.html')
    .pipe(inlinesource({
      compress: true,
      rootpath: path.resolve(path.join(__dirname, 'public/'))
    }))
    .pipe(htmlmin({
      collapseWhitespace: true,
      conservativeCollapse: true,
      collapseBooleanAttributes: true,
      decodeEntities: true,
      processConditionalComments: true,
      removeAttributeQuotes: true,
      removeComments: true,
      // removeEmptyAttributes: true,
      // removeOptionalTags: true,
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

gulp.task('build:sitemap', () => {
  const env = Object.create(process.env)
  return spawn('babel-node', ['scripts/flatten-render-tree.js'], {
    stdio: 'inherit',
    env
  })
})

gulp.task('watch', () => {
  gulp.watch('./sass/**', [ 'css' ])
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
    'build:sitemap',
    'build:packages',
    'build:hugo',
    'build:html-minify',
    'revision',
    done
  )
})

gulp.task('default', ['watch'])
