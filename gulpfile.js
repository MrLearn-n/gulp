const { src, dest }= require('gulp');
const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const cssbeautify = require('gulp-cssbeautify');
const removecomments = require('gulp-strip-css-comments');
const rename = require('gulp-rename');
const rigger = require('gulp-rigger');
const sass = require('gulp-sass')(require('sass'));
const cssnano = require('gulp-cssnano');
const uglify = require('gulp-uglify');
const plumber = require('gulp-plumber');
const panini = require('panini');
const imagemin = require('gulp-imagemin');
const del = require('del');
const notify = require('gulp-notify');
const imagewebp = require('gulp-webp');
const bs = require('browser-sync').create();

const srcPath = 'src/';
const distPath = 'dist/';

const path = {
    build: {
        html: distPath,
        css: distPath + "css/",
        js: distPath + "js/",
        images: distPath + "img/",
        fonts: distPath + "fonts/",
    },
    src: {
        html: srcPath + "*.html",
        css: srcPath + "scss/*.scss",
        js: srcPath + "js/*.js",
        images: srcPath + "img/**/*.{jpg,png,svg,gif,ico,webp}",
        fonts: srcPath + "font/**/*.{eot,woff,woff2,ttf}",
    },
    watch: {
        html: srcPath + "**/*.html",
        css: srcPath + "scss/**/*.scss",
        js: srcPath + "js/**/*.js",
        images: srcPath + "img/**/*.{jpg,png,svg,gif,ico,webp}",
        fonts: srcPath + "font/**/*.{eot,woff,woff2,ttf}",
    },
    clean: "./" + distPath,
}

function server() {
    bs.init({
        server: {
            baseDir: './' + distPath,
        }
    })
}

function html() {
    panini.refresh();
    return src(path.src.html, {base: srcPath})
        .pipe(plumber())
        .pipe(panini({
            root: srcPath,
            layouts: srcPath + "components/layouts/",
            partials: srcPath + "components/partials/",
          }))
        .pipe(dest(path.build.html))
        .pipe(bs.reload({stream: true}));
}

function css() {
    return src (path.src.css, {base: srcPath + "scss/"})
        .pipe(plumber({
            errorHandler: function(err) {
                notify.onError({
                    title: "SCSS - Ошибка компиляции",
                    message: "Error: <%= error.message %>",
                })(err);
                this.emit('end');
            }
        }))
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(cssbeautify())
        .pipe(dest(path.build.css))
        .pipe(cssnano({
            zindex: false,
            discardComments: {
                removeAll: true,
            }
        }))
        .pipe(removecomments())
        .pipe(rename({
            suffix: ".min",
            extname: ".css",
        }))
        .pipe(dest(path.build.css))
        .pipe(bs.reload({stream: true}));
}

function js() {
    return src(path.src.js, {base: srcPath + "js/"})
        .pipe(plumber({
            errorHandler: function(err) {
                notify.onError({
                    title: "JS - Ошибка компиляции",
                    message: "Error: <%= error.message %>",
                    sound: 'Beep',
                })(err);
                this.emit('end');
            }
        }))
        .pipe(rigger())
        .pipe(dest(path.build.js))
        .pipe(uglify())
        .pipe(rename({
            suffix: ".min",
            extname: ".js",
        }))
        .pipe(dest(path.build.js))
        .pipe(bs.reload({stream: true}));
}

function images() {
    return src(path.src.js, {base: srcPath + "img/"})
        .pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.mozjpeg({quality: 75, progressive: true}),
            imagemin.optipng({optimizationLevel: 5}),
            imagemin.svgo({
                plugins: [
                    {removeViewBox: true},
                    {cleanupIDs: false},
                ]
            })
        ]))
        .pipe(dest(path.build.images))
        .pipe(bs.reload({stream: true}));
}

function webpImages() {
    return src(path.src.images, {base: srcPath + "img/"})
        .pipe(imagewebp())
        .pipe(dest(path.build.images));
}

function fonts() {
    return src(path.src.fonts, {base: srcPath + "font/"})
        .pipe(dest(path.build.fonts))
        .pipe(bs.reload({stream: true}));
}

function clean() {
    return del(path.clean);
}

function wathcFiles() {
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.css], css);
    gulp.watch([path.watch.js], js);
    gulp.watch([path.watch.images], images);
    gulp.watch([path.watch.fonts], fonts);
}

const build = gulp.series(clean, gulp.parallel(html, css, js, images, webpImages, fonts));
const watch = gulp.parallel(build, wathcFiles, server)

exports.html = html;
exports.css = css;
exports.js = js;
exports.webpImages = webpImages;
exports.images = images;
exports.fonts= fonts;
exports.clean = clean;
exports.build = build;
exports.watch = watch;
exports.default = watch;
