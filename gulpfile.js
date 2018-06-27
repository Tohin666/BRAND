var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');

gulp.task('scss', function () {
  gulp.src('src/style/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('src'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('browserSync', function () {
  browserSync({
    server: {
      baseDir: 'src'
    }
  })
});

gulp.task('watch', ['browserSync'], function () {
  gulp.watch('src/style/*.scss', ['scss']);
  gulp.watch('src/*.html', browserSync.reload);
  gulp.watch('src/js/*.js', browserSync.reload)
});