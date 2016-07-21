/**
 * Created by lichengjun on 16/7/20.
 */
/*
 * grunt-jason-rev
 * https://github.com/Jason618/grunt-jason-rev
 *
 * Copyright (c) 2016 Jason
 * Licensed under the MIT license.
 */

'use strict';
var crypto = require("crypto");
var path = require("path");
var fs = require("fs");
var eachAsync = require("each-async");
var chalk = require("chalk");

module.exports = function (grunt) {

    // Please see the Grunt documentation for more information regarding task
    // creation: https://github.com/Jason618/grunt-jason-rev

    grunt.registerMultiTask('jason_rev', 'replace static resource url in my project', function () {
        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
            algorithm: 'md5',
            length: 8,
            fileExt: ".html",
            jsUrlReg: /<script[^\>]+src=['"]([^"']+)["']/gmi,  //   查找 html 文件中的 JS 文件
            cssUrlReg: /<link[^\>]+href=['"]([^"']+)["']/gmi   //  查找 html 文件中的 CSS 文件
        });

        //根据html文件中静态资源的引用路径(相对) 得到资源文件的在磁盘的路径
        /*
         * @param url  页面内静态资源的url
         * @param  fileUrl  html文件的url
         * */
        function getStaticFileUrl(url, fileUrl) {
            var htmlPathArray = fileUrl.split("/");
            var htmlPathArrayLen = htmlPathArray.length;

            grunt.log.writeln("htmlPathArray:" + htmlPathArray);
            var indexReg;
            var ralativePathSign;
            //绝对资源路径不处理  TODO
            if (url.indexOf("http") > -1) {
                return "no";
            }
            //相对路径的情况   ../    可以有多级
            indexReg = new RegExp(/^..\//i);
            //ralativePathSign = indexReg.test(url);
            var returnUrl;
            if (url.indexOf('../') > -1) {
                var pathLevel = 0;
                var pathArray = url.match(/^..\//gm);
                for (var i = 0, len = pathArray.length; i < len; i++) {
                    if (pathArray[i] === '../') {
                        pathLevel += 1;
                    }
                }

                htmlPathArray.length = htmlPathArrayLen - pathLevel - 1;
                returnUrl = htmlPathArray.join("/") + "/" + path.join(htmlPathArray.toString(), url);
            } else {
                var dirname = path.dirname(fileUrl);
                returnUrl = path.join(dirname, url);
            }

            //如果将要替换的url实际资源不存在 退出
            if (!grunt.file.exists(returnUrl)) {
                return "no";
            }

            //returnUrl 为资源文件的完全文件位置路径
            //匹配hash 文件
            var hash = crypto.createHash(options.algorithm).update(fs.readFileSync(returnUrl)).digest('hex');
            var suffix = hash.slice(0, options.length);
            var hashFileUrl = url.slice(0, -2) + suffix + ".js";

            return hashFileUrl;
            //相对路径的情况   /js/index.js
            //相对路径的情况 js/index.js
        }

        eachAsync(this.files, function (el, i, next) {
            grunt.log.writeln('路径替换工作开始。。。。。。');
            if (el.dest) {
                grunt.log.writeln("el.dest:" + el.dest);
            }


            el.src.forEach(function (file) {
                //文件加路径不处理
                if (grunt.file.isDir(file)) {
                    return;
                }
                var fileExt = path.extname(file);
                var dirname = path.dirname(file);

                grunt.log.writeln("fileExt:" + fileExt);
                //只处理html文件内的css,javascript文件路径
                if (options.fileExt == fileExt) {

                    //js文件路径替换
                    var content = grunt.file.read(file);
                    grunt.log.writeln("正在执行资源替换的html文件:" + file);
                    var jsMatchString, cssMatchString, jsUrls = [], cssUrls = [];
                    while ((jsMatchString = options.jsUrlReg.exec(content)) && jsMatchString != null) {
                        jsUrls.push(jsMatchString[1] ? jsMatchString[1] : "");
                    }
                    while ((cssMatchString = options.cssUrlReg.exec(content)) && cssMatchString != null) {
                        cssUrls.push(cssMatchString[1] ? cssMatchString[1] : "");
                    }
                    var replaceContent;
                    jsUrls.forEach(function (ele, index) {
                        grunt.log.writeln("将要替换的页面url: " + ele);
                        //获取带HASH的文件路径
                        var hashUrl = getStaticFileUrl(ele, file);
                        if (hashUrl == "no") {
                            grunt.fail.warn("资源路径出错--" + ele);
                        }
                        replaceContent = content.replace(ele, hashUrl);
                        content = replaceContent;
                    });
                    cssUrls.forEach(function (ele, index) {
                        grunt.log.writeln("将要替换的页面url: " + ele);
                        //获取带HASH的文件路径
                        var hashUrl = getStaticFileUrl(ele, file);
                        if (hashUrl == "no") {
                            grunt.fail.warn("资源路径出错--" + ele);
                        }
                        replaceContent = content.replace(ele, hashUrl);
                        content = replaceContent;
                    });
                    //将替换好的字符串重写写入文件
                    grunt.file.write(file, replaceContent);
                }
            });
            next();
        }, this.async());

    });

};
