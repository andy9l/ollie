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
    .on('end', cb)
}

function copyExtensionJSFiles(cb) {
  src([
    `./src/background.js`,
    `./src/content_script.js`,
    `./src/helper.js`,
  ])
    .pipe(uglify())
    .pipe(dest(`./release`))
    .on('end', cb)
}

function copyExtensionManifest(cb) {
  src(`./manifest.json`)
    .pipe(dest(`./release`))
    .on('end', cb)
}

function copyImages(cb) {
  src(`./images/*.png`)
    .pipe(dest(`./release/images`))
    .on('end', cb)
}

exports.default = series(cleanReleaseFolder, copyPopupFiles, copyExtensionJSFiles, copyExtensionManifest, copyImages)