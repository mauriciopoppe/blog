const path = require('path')
const spawn = require('child_process').spawn

const gulp = require('gulp')
const sass = require('gulp-sass')
const postcss = require('gulp-postcss')
const globby = require('globby')

const autoprefixer = require('autoprefixer')
const cssNano = require('cssnano')

gulp.task('css', function () {
  const processors = [
    autoprefixer,
    cssNano
  ]
  return gulp.src('./themes/blank/_compile/sass/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss(processors))
    .pipe(gulp.dest('./themes/blank/static/css'))
})

gulp.task('js:package', () => {
  // iterate over every package and execute rollup watch
  globby('packages/browser-*/', { mark: true })
    .then(dirs => {
      dirs.forEach(dir => {
        spawn('npm', ['run', 'build', '--', '--watch'], {
          cwd: path.join(process.cwd(), dir),
          stdio: 'inherit'
        })
      })
    })
})

gulp.task('watch', function () {
  gulp.watch('./themes/blank/_compile/sass/**/*.scss', [ 'css' ])
})

gulp.task('default', ['watch', 'js:package'])
