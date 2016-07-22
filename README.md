# grunt-jason-rev

> 将html文件里引用的JS,CSS文件路径使用HASH路径替换
> [使用替换前,需要自己手动生成带HASH的文件]

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-jason-rev --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-my-rev');
```

## The "jason_rev" task

### Overview
In your project's Gruntfile, add a section named `jason_rev` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  jason_rev: {
      default_options: {
          options: {},
          files: [{
              expand: true,
              cwd: 'test/',
              src: ['**/*.html'],
              dest: 'temp/public'
          }]
      }
          }
});
```

### Options

#### options.length
Type: `int`
Default value: 8

HASH字符串长度

#### options.algorithm
Type: `String`
Default value: 'dm5'

加密算法

### Usage Examples

执行grunt test  会将test/fixtures/index.html  文件中的js/css文件路径替换为该文件计算HASH之后取8位长度拼接的新的URL

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).
##git
https://github.com/Jason618/grunt-jason-rev

## Release History
_v0.1.0_
_v0.1.1_
_v0.1.2_
####fix bug

