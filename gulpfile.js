// generated on 2017-03-23 using generator-webapp 2.4.1
const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const browserSync = require('browser-sync').create();
const del = require('del');
const wiredep = require('wiredep').stream;
const runSequence = require('run-sequence');
const sass = require('gulp-dart-sass');
const $ = gulpLoadPlugins();
const reload = browserSync.reload;

var dev = true;


// MARK: code created for this project specifically
function getUrltoFile (urlSource, fileName) {
  var http = require('http');
  var url = require('url');
  var options = {
      host: url.parse(urlSource).hostname,
      path: url.parse(urlSource).pathname + unescape(url.parse(urlSource).search || '')
  }
  console.log (options.path);
  var request = http.request(options, function (res) {
      var data = '';
      res.on('data', function (chunk) {
          data += chunk;
      });
      //console.log (data);
      res.on('end', function () {
        var fs = require('fs');
        if (data !== '') {
          fs.writeFile(fileName, data, function(err) {
              if(err) {
                  return console.log(err);
              }
              console.log(urlSource);
              console.log('writen to');
              console.log(fileName);
          });
        } else {
          console.log (fileName + ' is empty! Not Updated! ')
        }
      });
  });
  request.on('error', function (e) {
      console.log(e.message);
  });
  request.end();
}


function postDatatoFile (urlSource, postData, fileName) {
  var url = require('url');
  var querystring = require('querystring');
  var post_data = JSON.stringify(postData);
  var http = require('http');
  var options = {
      host: url.parse(urlSource).hostname,
      path: url.parse(urlSource).pathname + unescape(url.parse(urlSource).search),
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': post_data.length
      }
  }
  var request = http.request(options, function (res) {
      var data = '';
      res.on('data', function (chunk) {
          data += chunk;
      });
      res.on('end', function () {
        var fs = require('fs');
        fs.writeFile(fileName, data, function(err) {
            if(err) {
                return console.log(err);
            }
            console.log(urlSource);
            console.log('post data writen to');
            console.log('fileName');
        }); 
      });
  });
  request.on('error', function (e) {
      console.log(e.message);
  });
  request.write(post_data);
  request.end();
}

function lint(files) {
  return gulp.src(files)
    .pipe($.eslint({ fix: true }))
    .pipe(reload({stream: true, once: true}))
    .pipe($.eslint.format())
    .pipe($.if(!browserSync.active, $.eslint.failAfterError()));
}

gulp.task('lint', () => {
  return lint('app/scripts/**/*.js')
    .pipe(gulp.dest('app/scripts'));
});
gulp.task('lint:test', () => {
  return lint('test/spec/**/*.js')
    .pipe(gulp.dest('test/spec'));
});


gulp.task('origami', function () {
  getUrltoFile('http://build.origami.ft.com/bundles/js?modules=o-ft-header@^2.5.15,o-table@^1.6.0', './bower_components/origami/build.js');
  getUrltoFile ('http://build.origami.ft.com/bundles/css?modules=o-ft-header@^2.5.15,o-ft-footer@^2.0.4,o-table@^1.6.0', './bower_components/origami/build.scss');
});


gulp.task('ea', function () {
  var message = {};
  message.head = {};
  message.head.transactiontype = '10001';
  message.head.source = 'web';
  message.body = {};
  message.body.ielement = {};
  message.body.ielement.num = 25;
  //http://app003.ftmailbox.com/index.php/jsapi/get_last_publish_story?day=2015-6-17&

  //postDatatoFile('http://m.ftchinese.com/eaclient/apijson.php', message, './app/api/ea001.json');
  //postDatatoFile('http://m.ftchinese.com/index.php/jsapi/get_last_publish_story?day=2016-1-8&', message, './app/api/ea001.json');
  postDatatoFile('http://app003.ftmailbox.com/index.php/jsapi/get_new_story?rows=25&', message, './app/api/ea001.json');
  message.head.transactiontype = '10003';
  postDatatoFile('http://m.ftchinese.com/eaclient/apijson.php', message, './app/api/ea003.json');
  message.head.transactiontype = '10007';
  postDatatoFile('http://m.ftchinese.com/eaclient/apijson.php', message, './app/api/ea007.json');
  getUrltoFile ('http://m.ftchinese.com/index.php/ft/channel/phonetemplate.html?channel=nexthome', './app/api/homecontent.html');
  getUrltoFile ('http://m.ftchinese.com/index.php/ft/channel/phonetemplate.html?channel=china', './app/api/channel.html');
  //getUrltoFile ('http://m.ftchinese.com/index.php/ft/channel/phonetemplate.html?channel=homecontentsource&date=20160108', './app/api/homecontent.html');
  getUrltoFile ('http://m.ftchinese.com/index.php/ft/channel/phonetemplate.html?channel=nexthome&screentype=wide', './app/api/homecontentwide.html');
  getUrltoFile ('http://m.ftchinese.com/index.php/ft/channel/phonetemplate.html?', './app/api/home.tpl');
  getUrltoFile ('http://m.ftchinese.com/index.php/ft/channel/phonetemplate.html?channel=homepagevideo&', './app/api/homepagevideo.tpl');
  getUrltoFile ('http://m.ftchinese.com/index.php/ft/channel/phonetemplate.html?channel=skyZ&', './app/api/skyZ.tpl');
  getUrltoFile ('http://m.ftchinese.com/index.php/ft/channel/ipadvideo.html?', './app/api/ipadvideo.tpl');
  getUrltoFile ('http://m.ftchinese.com/index.php/jsapi/get_last_updatetime?', './app/api/get_last_updatetime.json');
  getUrltoFile ('http://m.ftchinese.com/index.php/jsapi/hotstory/1days?', './app/api/hotstory.json');
});

gulp.task('hp', () => {
  gulp.src('app/api/homecontent.html')
    .pipe(gulp.dest('../dev_www/frontend/tpl/phone'));
  gulp.src('app/api/homecontentwide.html')
    .pipe(gulp.dest('../dev_www/frontend/tpl/phone'));
});


gulp.task('phone', () => {
  return gulp.src('app/phone/**/*')
    .pipe(gulp.dest('dist/phone'));
});

gulp.task('api', () => {
  return gulp.src('app/api/**/*')
    .pipe(gulp.dest('dist/api'));
});

gulp.task('log', () => {
  return gulp.src('app/log/**/*')
    .pipe(gulp.dest('dist/log'));
});

gulp.task('styles', () => {
  return gulp.src('app/styles/main.scss')
    .pipe($.plumber())
    .pipe($.if(dev, $.sourcemaps.init()))
    .pipe(sass.sync({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['.']
    }).on('error', sass.logError))
    .pipe($.autoprefixer({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']}))
    .pipe($.if(dev, $.sourcemaps.write()))
    .pipe(gulp.dest('.tmp/styles'))
    .pipe(reload({stream: true}));
});

gulp.task('scripts', () => {
  return gulp.src('app/scripts/**/*.js')
    .pipe($.plumber())
    .pipe($.if(dev, $.sourcemaps.init()))
    .pipe($.babel())
    .pipe($.if(dev, $.sourcemaps.write('.')))
    .pipe(gulp.dest('.tmp/scripts'))
    .pipe(reload({stream: true}));
});




gulp.task('images', () => {
  return gulp.src('app/images/**/*')
    .pipe($.cache($.imagemin()))
    .pipe(gulp.dest('dist/images'));
});

gulp.task('fonts', () => {
  return gulp.src(require('main-bower-files')('**/*.{eot,svg,ttf,woff,woff2}', function (err) {})
    .concat('app/fonts/**/*'))
    .pipe($.if(dev, gulp.dest('.tmp/fonts'), gulp.dest('dist/fonts')));
});

gulp.task('extras', () => {
  return gulp.src([
    'app/*',
    '!app/*.html'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'));
});

gulp.task('clean', del.bind(null, ['.tmp', 'dist']));

gulp.task('html', gulp.series('styles', 'scripts', () => {
  return gulp.src('app/*.html')
    .pipe($.useref({searchPath: ['.tmp', 'app', '.']}))
    .pipe($.if(/\.js$/, $.uglify({compress: {drop_console: true}})))
    .pipe($.if(/\.css$/, $.cssnano({safe: true, autoprefixer: false})))
    .pipe($.if(/\.html$/, $.htmlmin({
      collapseWhitespace: true,
      minifyCSS: true,
      minifyJS: {compress: {drop_console: true}},
      processConditionalComments: true,
      removeComments: true,
      removeEmptyAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true
    })))
    .pipe(gulp.dest('dist'));
}));


gulp.task('ga', function () {
  //var gaUrl = 'http://m.ftchinese.com/index.php/jsapi/analytics';
  var gaUrl = 'https://www.google-analytics.com/analytics.js';
  getUrltoFile(gaUrl, './app/log/ga.js');
  //getUrltoFile(gaUrl, './dist/log/ga.js');
});

// // MARK: - add more actions in build
gulp.task('build', gulp.series('lint', 'html', 'images', 'fonts', 'extras', 'api', 'phone', 'log', 'ga', () => {
  return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
}));

gulp.task('copy', gulp.series('build', function () {
  var replace = require('gulp-replace');
  var rename = require("gulp-rename");
  var thedatestamp = new Date().getTime();
  gulp.src('dist/**/*')
    .pipe(gulp.dest('../testing/dev_www/mobile_webroot/'));
  gulp.src(['dist/index.html'])
    .pipe(replace(/\<html\>/g, '<html manifest="iphone-2014.manifest">'))
    .pipe(replace(/=phone\//g, '=iphone-2014/'))
    .pipe(rename('iphone-2014.html'))
    .pipe(gulp.dest('../testing/dev_www/mobile_webroot/'));
  gulp.src(['dist/index.html'])
    .pipe(replace(/\<html\>/g, '<html manifest="ipad-2014.manifest">'))
    .pipe(replace(/=phone\//g, '=ipad-2014/'))
    .pipe(rename("ipad-2014.html"))
    .pipe(gulp.dest('../testing/dev_www/mobile_webroot/'));
  gulp.src(['dist/index.html'])
    .pipe(replace(/\<html\>/g, '<html manifest="bb-2014.manifest">'))
    .pipe(replace(/=phone\//g, '=bb-2014/'))
    .pipe(rename("bb-2014.html"))
    .pipe(gulp.dest('../testing/dev_www/mobile_webroot/'));
  gulp.src(['dist/index.html'])
    .pipe(replace(/\<html\>/g, '<html manifest="phone-2014.manifest">'))
    .pipe(rename("phone.html"))
    .pipe(gulp.dest('../testing/dev_www/mobile_webroot/'));
  gulp.src(['dist/index.html'])
    .pipe(replace(/\<html\>/g, '<html manifest="phone-2014.manifest">'))
    .pipe(rename("phoneapp.html"))
    .pipe(gulp.dest('../testing/dev_www/mobile_webroot/'));
  gulp.src(['dist/mba.html'])
    .pipe(replace(/\<html\>/g, '<html manifest="mba-2014.manifest">'))
    .pipe(replace(/=phone\//g, '=mba-2014/'))
    .pipe(rename("mba-2014.html"))
    .pipe(gulp.dest('../testing/dev_www/mobile_webroot/'));
  gulp.src(['dist/phone/**/*'])
    .pipe(gulp.dest('../testing/dev_www/mobile_webroot/iphone-2014'));
  gulp.src(['dist/phone/**/*'])
    .pipe(gulp.dest('../testing/dev_www/mobile_webroot/ipad-2014'));
  gulp.src(['dist/phone/**/*'])
    .pipe(gulp.dest('../testing/dev_www/mobile_webroot/bb-2014'));
    gulp.src(['dist/phone/**/*'])
    .pipe(gulp.dest('../testing/dev_www/mobile_webroot/mba-2014'));
  gulp.src(['app/cache/phone.manifest'])
    .pipe(replace(/#changelogdatestamp/g, '#datestamp' + thedatestamp))
    .pipe(rename('phone-2014.manifest'))
    .pipe(gulp.dest('../testing/dev_www/mobile_webroot/'));
  gulp.src(['app/cache/phone.manifest'])
    .pipe(replace(/#changelogdatestamp/g, '#datestamp' + thedatestamp))
    .pipe(replace(/phone\//g, 'iphone-2014/'))
    .pipe(rename('iphone-2014.manifest'))
    .pipe(gulp.dest('../testing/dev_www/mobile_webroot/'));
  gulp.src(['app/cache/phone.manifest'])
    .pipe(replace(/#changelogdatestamp/g, '#datestamp' + thedatestamp))
    .pipe(replace(/phone\//g, 'ipad-2014/'))
    .pipe(rename('ipad-2014.manifest'))
    .pipe(gulp.dest('../testing/dev_www/mobile_webroot/'));
  gulp.src(['app/cache/phone.manifest'])
    .pipe(replace(/#changelogdatestamp/g, '#datestamp' + thedatestamp))
    .pipe(replace(/phone\//g, 'bb-2014/'))
    .pipe(rename('bb-2014.manifest'))
    .pipe(gulp.dest('../testing/dev_www/mobile_webroot/'));
  gulp.src(['app/cache/android.manifest'])
    .pipe(replace(/#changelogdatestamp/g, '#datestamp' + thedatestamp))
    .pipe(rename('android-2014.manifest'))
    .pipe(gulp.dest('../testing/dev_www/mobile_webroot/'));
  gulp.src(['app/cache/mba.manifest'])
    .pipe(replace(/#changelogdatestamp/g, '#datestamp' + thedatestamp))
    .pipe(replace(/phone\//g, 'mba-2014/'))
    .pipe(rename('mba-2014.manifest'))
    .pipe(gulp.dest('../testing/dev_www/mobile_webroot/'));
  gulp.src(['dist/images/**/*'])
    .pipe(gulp.dest('../testing/dev_www/mobile_webroot/images'));

  
  // android file;
  var fs = require('fs');
  var cssbundle = fs.readFileSync('dist/phone/s.css', 'utf8');
  var googleanalytics = fs.readFileSync('app/log/ga.js', 'utf8');

  if (googleanalytics === '') {
    return console.log ('Google analytics js file is empty, please try again! ')
  }
  //var fa = fs.readFileSync('dist/log/analytics.js', 'utf8');
  var fa = '';

  // MARK: - use the one m.js file 
  var mainM = fs.readFileSync('dist/phone/m.js', 'utf8');
  // mainM = mainM.replace('</script>', '</scr\' + \'ipt>');

  return gulp.src(['app/android.html'])
    .pipe($.if('*.html', $.htmlmin({collapseWhitespace: true})))
    .pipe(replace('{{cssbundle}}', cssbundle))
    .pipe(replace('{{googleanalytics}}', googleanalytics))
    .pipe(replace('{{fa}}', fa))
    .pipe(replace('{{main-m}}', mainM))
    //.pipe(replace('<html>', '<html manifest="android-2014.manifest">'))
    .pipe(rename('androidapp.html'))
    .pipe(gulp.dest('../testing/dev_www/mobile_webroot/'))
    .on('end', function() {
      var fs = require('fs');
      var chineseConv = require('chinese-conv');
      var htmlFileInString = fs.readFileSync('../testing/dev_www/mobile_webroot/androidapp.html', 'utf8');
      var data = chineseConv.tify(htmlFileInString);
      var fileName = '../testing/dev_www/mobile_webroot/androidappbig5.html';
      fs.writeFile(fileName, data, function(err) {
            if(err) {
                return console.log(err);
            }
            console.log('big 5 file writen to ' + fileName);
      });
    });
}));


gulp.task('publish', function () {
  gulp.src('../testing/dev_www/mobile_webroot/phone/**/*')
    .pipe(gulp.dest('../dev_www/mobile_webroot/phone'));
  gulp.src('../testing/dev_www/mobile_webroot/ipad-2014/**/*')
    .pipe(gulp.dest('../dev_www/mobile_webroot/ipad-2014'));
  gulp.src('../testing/dev_www/mobile_webroot/iphone-2014/**/*')
    .pipe(gulp.dest('../dev_www/mobile_webroot/iphone-2014'));
  gulp.src('../testing/dev_www/mobile_webroot/bb-2014/**/*')
    .pipe(gulp.dest('../dev_www/mobile_webroot/bb-2014'));
  gulp.src('../testing/dev_www/mobile_webroot/mba-2014/**/*')
    .pipe(gulp.dest('../dev_www/mobile_webroot/mba-2014'));
  gulp.src('../testing/dev_www/mobile_webroot/log/**/*')
    .pipe(gulp.dest('../dev_www/mobile_webroot/log'));
  gulp.src('../testing/dev_www/mobile_webroot/assets/svg/**/*')
    .pipe(gulp.dest('../dev_www/mobile_webroot/assets/svg'));
  gulp.src('../testing/dev_www/mobile_webroot/*.manifest')
    .pipe(gulp.dest('../dev_www/mobile_webroot/'));
  gulp.src('../testing/dev_www/mobile_webroot/phone.html')
    .pipe(gulp.dest('../dev_www/mobile_webroot/'));
  gulp.src('../testing/dev_www/mobile_webroot/phoneapp.html')
    .pipe(gulp.dest('../dev_www/mobile_webroot/'));
  gulp.src('../testing/dev_www/mobile_webroot/iphone-2014.html')
    .pipe(gulp.dest('../dev_www/mobile_webroot/'));
  gulp.src('../testing/dev_www/mobile_webroot/bb-2014.html')
    .pipe(gulp.dest('../dev_www/mobile_webroot/'));
  gulp.src('../testing/dev_www/mobile_webroot/ipad-2014.html')
    .pipe(gulp.dest('../dev_www/mobile_webroot/'));
  gulp.src('../testing/dev_www/mobile_webroot/androidapp.html')
    .pipe(gulp.dest('../dev_www/mobile_webroot/'));
  gulp.src('../testing/dev_www/mobile_webroot/androidappbig5.html')
    .pipe(gulp.dest('../dev_www/mobile_webroot/'));
  gulp.src('../testing/dev_www/mobile_webroot/mba-2014.html')
    .pipe(gulp.dest('../dev_www/mobile_webroot/'));
  gulp.src('../testing/dev_www/mobile_webroot/images/**/*')
    .pipe(gulp.dest('../dev_www/mobile_webroot/images'));
});

gulp.task('ios', gulp.series('publish', function () {
  var rename = require("gulp-rename");
  gulp.src('../testing/dev_www/mobile_webroot/androidapp.html')
    .pipe(rename('index.html'))
    .pipe(gulp.dest('../../sandbox/FTCiPhone/FT Academy/supporting/'));
  gulp.src('../testing/dev_www/mobile_webroot/androidappbig5.html')
    .pipe(rename('indexBig5.html'))
    .pipe(gulp.dest('../../sandbox/FTCiPhone/FT Academy/supporting/'));
}));



// MARK: - Code created from generator (might be edidted)



// gulp.task('serve', () => {

  // runSequence(['clean', 'wiredep'], ['styles', 'scripts', 'fonts'], () => {
  //   browserSync.init({
  //     notify: false,
  //     port: 9000,
  //     server: {
  //       baseDir: ['.tmp', 'app'],
  //       routes: {
  //         '/bower_components': 'bower_components'
  //       }
  //     }
  //   });

  //   gulp.watch([
  //     'app/*.html',
  //     'app/images/**/*',
  //     '.tmp/fonts/**/*'
  //   ]).on('change', reload);

  //   gulp.watch('app/styles/**/*.scss', ['styles']);
  //   gulp.watch('app/scripts/**/*.js', ['scripts']);
  //   gulp.watch('app/fonts/**/*', ['fonts']);
  //   gulp.watch('bower.json', ['wiredep', 'fonts']);
  // });
// });


gulp.task('serve', 
  gulp.parallel(
    'styles', 
    'scripts', 
    'fonts',
    function serve() {
    browserSync.init({
      server: {
        baseDir: ['app', '.tmp'],
        index: 'index.html',
        routes: {
          '/node_modules': 'node_modules'
        }
      }
    });

    gulp.watch('app/styles/**/*.scss', gulp.parallel('styles'));
    gulp.watch(['app/*.html', 'app/scripts/**/*.js', 'app/fonts/**/*'], browserSync.reload);
  })
);



gulp.task('default', () => {
  return new Promise(resolve => {
    dev = false;
    runSequence(['clean', 'wiredep'], 'build', resolve);
  });
});


gulp.task('serve:dist', gulp.series('default', () => {
  browserSync.init({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['dist']
    }
  });
}));

gulp.task('serve:test', gulp.series('scripts', () => {
  browserSync.init({
    notify: false,
    port: 9000,
    ui: false,
    server: {
      baseDir: 'test',
      routes: {
        '/scripts': '.tmp/scripts',
        '/bower_components': 'bower_components'
      }
    }
  });

  gulp.watch('app/scripts/**/*.js', ['scripts']);
  gulp.watch(['test/spec/**/*.js', 'test/index.html']).on('change', reload);
  gulp.watch('test/spec/**/*.js', ['lint:test']);
}));

// inject bower components
gulp.task('wiredep', () => {
  gulp.src('app/styles/*.scss')
    .pipe($.filter(file => file.stat && file.stat.size))
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)+/
    }))
    .pipe(gulp.dest('app/styles'));

  gulp.src('app/*.html')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)*\.\./
    }))
    .pipe(gulp.dest('app'));
});




