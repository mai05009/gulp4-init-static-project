const {
  src,
  dest,
  series,
  parallel,
  watch
} = require('gulp');
const gulpif = require('gulp-if');
const gclean = require('gulp-clean');
const imagemin = require('gulp-imagemin');
const autoprefixer = require('gulp-autoprefixer')
const minifyCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const rev = require('gulp-rev');
const revCollector = require('gulp-rev-collector');
const htmlmin = require('gulp-htmlmin')
const fileinclude = require('gulp-file-include');
const sass = require("gulp-sass");
var preprocess = require("gulp-preprocess");
const browserSync = require('browser-sync'); // 自动刷新
const changed = require('gulp-changed');
const reload = browserSync.reload;

const config = require('./gulp.env.js');

const {
  createProxyMiddleware
} = require('http-proxy-middleware');

//代理
const proxy = createProxyMiddleware('/dev-api', {
  target: 'http://www.example.org',//后台接口地址
  changeOrigin: true,
  pathRewrite: { //路径重写规则 
    '^/dev-api': ''
  }
});


var env = 'dev';

/**
 * @description: 
 * @param {string} type "dev"运行环境,"build"编译环境会压缩
 * @return {void}
 */
async function set_dev_env(type) {
  env = "dev"
  await console.log(env);
}

async function set_build_env(type) {
  env = "build"
  await console.log(env);
}

function clean() {
  return src(config[env].filePath + '/*', {
      read: false
    })
    .pipe(gclean());
}

function img() {
  return src('src/img/*', {
      base: 'src'
    })
    .pipe(imagemin({
      optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
      progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
      interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
      multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
    }))
    .pipe(changed(config[env].filePath))
    .pipe(dest(config[env].filePath))
    .pipe(reload({
      stream: true
    }));
}


function css() {
  return src('src/css/*.scss', {
      base: 'src'
    })
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      "overrideBrowserslist": [
        "last 3 versions"
      ]
    }))
    .pipe(minifyCSS())
    .pipe(gulpif(env === 'build', rev()))
    // .pipe(changed(config[env].filePath))
    .pipe(dest(config[env].filePath))
    .pipe(gulpif(env === 'build', rev.manifest()))
    .pipe(gulpif(env === 'build', dest('dist/rev/css')))
    .pipe(reload({
      stream: true
    }));
}

function js() {
  return src('src/js/*.js', {
      base: 'src'
    })
    .pipe(preprocess({
      context:{
        NODE_ENV: process.env.NODE_ENV || "test"
      }
    }))
    .pipe(babel({
      presets: ['@babel/env']
  }))
    .pipe(uglify({
      mangle: true
    }))
    .pipe(gulpif(env === 'build', rev()))
    .pipe(dest(config[env].filePath))
    .pipe(gulpif(env === 'build', rev.manifest()))
    .pipe(gulpif(env === 'build', dest('dist/rev/js')))
    .pipe(reload({
      stream: true
    }));
}

function revHtml() {
  return src([config[env].filePath + '/rev/**/*.json', 'view/*.html'])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(preprocess({
      context:{
        NODE_ENV: process.env.NODE_ENV || "test"
      }
    }))
    .pipe(revCollector({
      replaceReved: true, //允许替换, 已经被替换过的文件
    }))
    .pipe(htmlmin({
      removeComments: true, // 清除HTML注释
      collapseWhitespace: true, // 压缩空格
      collapseBooleanAttributes: true, // 省略布尔属性的值 <input checked="true"/> => <input checked>
      removeEmptyAttributes: true, // 删除所有空格作属性值 <input id=""> => <input>
      //removeScriptTypeAttributes: true,   // 删除<script>的type="text/javascript"
      //removeStyleLinkTypeAttributes: true,// 删除<style>和<link>的type="text/css"
      minifyJS: true, // 压缩页面JS
      minifyCSS: true // 压缩页面CSS
    }))
    .pipe(dest(config[env].filePath + '/'));
}

function html() {
  return src('view/*.html')
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(preprocess({
      context:{
        NODE_ENV: process.env.NODE_ENV || "test"
      }
    }))
    .pipe(dest(config[env].filePath + '/'))
    .pipe(browserSync.reload({
      stream: true
    }));
}

function copyLib() {
  return src('lib/**')
    .pipe(dest(config[env].filePath + '/lib'));
}

function server() {
  browserSync.init({
    notify: false, ////不显示在浏览器中的任何通知。
    port: 3005, // 本地服务端口
    server: {
      baseDir: './' + config[env].filePath,
      middleware: [proxy], // 使用中间件配置代理
      index: "index.html"
    }
  })
}

function watchList() {
  watch('src/css/*.scss', series(css))
  watch('src/img/*', series(img))
  watch('src/js/*.js', series(js))
  watch('/lib/*', series(copyLib))
  watch('view/*.html', series(html))
  watch(config[env].filePath + "/*.html").on('change', reload);
}


exports.init = series(clean, parallel(img, css, js), html, copyLib)
exports.dev = series(set_dev_env, clean, parallel(img, css, js), html, copyLib, parallel(server, watchList));
exports.build = series(set_build_env, clean, parallel(img, css, js), revHtml, copyLib);
exports.default = series(server, watchList);