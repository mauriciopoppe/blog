const path = require('path')
const { spawn } = require('child-process-promise')

const gulp = require('gulp')
const sass = require('gulp-sass')
const postcss = require('gulp-postcss')
const plumber = require('gulp-plumber')
const globby = require('globby')
const moduleImporter = require('sass-module-importer')

const autoprefixer = require('autoprefixer')
const cssNano = require('cssnano')

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

gulp.task('css', function () {
  const processors = [
    autoprefixer,
    cssNano
  ]
  return gulp.src('./themes/blank/_compile/sass/*.scss')
    .pipe(plumber())
    .pipe(sass({
      importer: moduleImporter()
    }))
    .pipe(postcss(processors))
    .pipe(gulp.dest('./themes/blank/static/css'))
})

gulp.task('watch', function () {
  gulp.watch('./themes/blank/_compile/sass/**', [ 'css' ])
})

gulp.task('build', function () {
  return Promise.resolve()
    .then(() => spawn('./node_modules/.bin/lerna', ['bootstrap'], { stdio: 'inherit' }))
    .then(() => execCommand(['npm', 'install']))
    .then(() => execCommand(['npm', 'run', 'build', '--', '-p']))
})

gulp.task('default', ['watch'])
