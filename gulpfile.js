var gulp=require("gulp");
var uglify=require("gulp-uglify");
var babel=require("gulp-babel");
var rename = require("gulp-rename");
/*var connect=require("gulp-connect");*/
var sass = require("gulp-ruby-sass");
var webserver = require("gulp-webserver");
var proxy = require('http-proxy-middleware');
gulp.task("minjs",function(){
	gulp.src("./js/*.js")
		.pipe(babel({presets:["es2015"]}))
		.pipe(uglify())
		.pipe(rename({suffix:".min"}))
		.pipe(gulp.dest("./minjs/"));
})
/*gulp.task("connect",function(){
	gulp.src("./html/*.html").pipe(connect.reload());
})*/
gulp.task("sass", function () { 
    sass("./scss/*.scss",{
        style: "expanded"
    }).pipe(gulp.dest("./css/"))
});

gulp.task("listener",function(){
	/* connect.server({
          livereload:true
    });*/
    /*gulp.watch("./html/*.html", ["connect"]);
    gulp.watch("./css/*.css", ["connect"]);
    gulp.watch("./js/*.js", ["connect"]);*/
	gulp.watch("./js/*.js",["minjs"])
	gulp.watch("./scss/*.scss",["sass"])
})

gulp.task("webserver",function(){
	gulp.src('./')
		.pipe(
			webserver({
				host: 'localhost',
				port: 8888,
				livereload: true,
				directoryListing: {
					enable: true,
					path: './'
				},

				middleware: [
					proxy('/api',{
						target: 'http://m.ingping.com/', // target host
        				changeOrigin: true,               // needed for virtual hosted sites
				        pathRewrite: {
				          'api' : '' // remove base path
				        }
					}),
					proxy('/comp',{
						target: 'http://www.ingping.com/', // target host
        				changeOrigin: true,               // needed for virtual hosted sites
				        pathRewrite: {
				          'comp' : '' // remove base path
				        }
					}),
					proxy('/zhu',{
						target: 'http://datainfo.duapp.com/', // target host
        				changeOrigin: true,               // needed for virtual hosted sites
				        pathRewrite: {
				          'zhu' : '' // remove base path
				        }
					})
				]
			})
		)
})
 gulp.task("default",["listener","webserver"],function(){
 	console.log(1);
 })
