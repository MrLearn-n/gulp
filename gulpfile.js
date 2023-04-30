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

function html() {
    return src(path.src.html, {base: srcPath})
        
}

function clean() {
    return del(path.clean);
}

exports.html = html;
exports.clean = clean;