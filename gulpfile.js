const { src, dest, series } = require('gulp')
const del = require('del')
const uglify = require('gulp-terser')

function cleanReleaseFolder(cb) {
  del.sync(`./release/**`, { force: true })
  cb()
}

function copyPopupFiles(cb) {
  src([
    `./build/index.html`,
    `./build/static/**/*.js`,
    `!./build/static/**/runtime-*.js`
  ], { base: './build' })
    .pipe(dest(`./release/popup`))
  cb()
}

function copyExtensionJSFiles(cb) {
  src([
    `./*.js`,
    `!./gulpfile.js`
  ])
    .pipe(uglify())
    .pipe(dest(`./release`))
  cb()
}

function copyExtensionManifest(cb) {
  src(`./manifest.json`)
    .pipe(dest(`./release`))
  cb()
}

function copyImages(cb) {
  src(`./images/*.png`)
    .pipe(dest(`./release/images`))
  cb()
}

exports.default = series(cleanReleaseFolder, copyPopupFiles, copyExtensionJSFiles, copyExtensionManifest, copyImages)