# 搭建一个在浏览器使用typescript的环境

[github地址](github.com/fanyoufu/learnty.git)

目录
[[toc]]

## 建立目录结构

```
package.json
src/
dist/
```
建议使用npm init 初始化 package.json文件


## 安装gulp 和 typescript

1. 全局安装gulp

```
npm install -g gulp-cli
```

2. 安装typescript，gulp和gulp-typescript到开发依赖项。

```
npm install --save-dev typescript gulp gulp-typescript
```
- typscript 是typescript的编译器
- gulp-typescript 是与gulp配合使用的gulp插件

## 编写ts文件

> 目录/src/main.ts
```
function hello(compiler: string) {
    console.log(`Hello from ${compiler}`);
}
hello("TypeScript");
```

## 配置tsconfig文件

在项目根目录下建立tsconfig.json文件。

> 目录/tsconfig.json

```
{
    "files": [
        "src/main.ts"
    ],
    "compilerOptions": {
        "noImplicitAny": true,
        "target": "es5"
    }
}
```
## 配置gulpfile.js文件
在项目目录下建立gulpfile.js文件，来配置gulp命令

> 目录/gulpfile.js文件

```
var gulp = require("gulp");
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");

gulp.task("default", function () {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest("dist"));
});
```

## 运行gulp命令，查看效果
```
gulp
node dist/main.js
```
- gulp 命令通过gulpfile.js的配置，把src/main.ts编译成dist/main.js文件。
此时在dist下会生成一个main.js文件，其文件的内容是：
```
function hello(compiler) {
    console.log("hello from " + compiler);
}
hello("TypeScript");
```
你可以回过去对比看看 main.ts的内容和现在的main.js的内容对比。

- node dist/main.js 命令是在node环境中执行main.js

以上是在node中执行javascript，那如何把javascript放在浏览器中执行呢？
其实你可以直接把这个main.js引入到你的html页面中。


## 使用多个ts文件

现实中的项目目录肯定会有很多个模块，表现在多离散的文件中。下面来尝试一下：

共三步.
### 1/3 新建一个src/greet.ts文件：
```
export function sayHello(name: string) {
    return `Hello from ${name}`;
}
```

### 2/3 更改src/main.ts代码，从greet.ts导入sayHello：
```
import { sayHello } from "./greet";

console.log(sayHello("TypeScript"));
```
### 3/3 最后，将src/greet.ts添加到tsconfig.json：
```
{
    "files": [
        "src/main.ts",
        "src/greet.ts"
    ],
    "compilerOptions": {
        "noImplicitAny": true,
        "target": "es5"
    }
}
```
注意：files的值是一个数组，数组中最后一个元素不要加“,”。如果你加了，有可能会在接下来的任务中出错。

确保执行gulp后模块是能工作的，在Node.js下进行测试：
```
gulp
node dist/main.js
```
你会得到如下：
dist/main.js
```
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var greet_1 = require("./greet");
console.log(greet_1.sayHello("Typescript"));

```
dist/greet.js
```
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function sayHello(name) {
    return "Hello from " + name;
}
exports.sayHello = sayHello;
```

注意，此时，你如果直接在.html文件中引用dist/main.js文件是会出错误的。原因是：浏览器中不认识require命令。 而在node环境是可以执行node main.js的，因为node支持commonJS的模块化。

我们来证明这一点。

## 在浏览器环境中使用main.js

### 创建src/index.html文件
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <p id="greeting">loading....</p>
    <script src="main.js"></script>
</body>
</html>
```

### 把index.htm从src目标拷贝到dist目录
为什么不直接在dist目录下创建这个index.html文件，而非要在src目录下创建好了再复制过去呢？ 因为src是源目录，dist是生产目录，我们只能把代码写在源目录中。

这个拷贝的过程是通过建立gulp任务来完成的

```
let gulp = require("gulp")

let ts = require("gulp-typescript")
let tsProject = ts.createProject("tsconfig.json");

let paths = {
    pages:["src/*.html"]
}
gulp.task("copy-html",function(){
    return gulp.src(paths.pages).pipe(gulp.dest("dist"))
});

gulp.task("default",gulp.series("copy-html",function(){
    return tsProject.src().pipe(tsProject()).js.pipe(gulp.dest("dist"))
}))
```

这里增加了copy-html任务并且把它加作default的依赖项。 这样，当default执行时，copy-html会被首先执行。

注意：default是默认任务，而第二个参数gulp.series()这种写法是gulp4.0的写法。gulp3.0的写法有个一点小区别。请大家根据自己gulp的版本来决定。


改造完gulpfile.js后，再次运行
```
gulp
```
可以看这个两个任务的结果:
1. index.html拷贝到了dist目录
2. main.ts,greet.ts被编译成了对应的.js文件。

### 浏览器中的export错误

此时，我们通过浏览器打开index.html文件，你会在浏览器中看到错误信息：
```
main.js:2 Uncaught ReferenceError: exports is not defined
    at main.js:2
```

那么，如何解决呢？

## 工程由Node.js环境移到浏览器环境里
现在，让我们把这个工程由Node.js环境移到浏览器环境里。 通过Browserify把所有模块捆绑成一个JavaScript文件。

### 安装依赖
```
npm install --save-dev browserify tsify vinyl-source-stream
```
首先，安装Browserify，tsify和vinyl-source-stream。 tsify是Browserify的一个插件，就像gulp-typescript一样，它能够访问TypeScript编译器。 vinyl-source-stream会将Browserify的输出文件适配成gulp能够解析的格式，它叫做vinyl。

### 修改gulpfile.js配置
几个要点：

1. 使用browserify处理typescript文件的插件tsify来代替 gulp-typescript
2. 配置browserify()打包.js文件到bundle.js

```
let gulp = require("gulp")

let browserify =require("browserify")
let source = require("vinyl-source-stream")
let tsify = require("tsify");

// let ts = require("gulp-typescript")
// let tsProject = ts.createProject("tsconfig.json");

let paths = {
    pages:["src/*.html"]
}
gulp.task("copy-html",function(){
    return gulp.src(paths.pages).pipe(gulp.dest("dist"))
});

gulp.task("default",gulp.series("copy-html",function(){
    // return tsProject.src().pipe(tsProject()).js.pipe(gulp.dest("dist"))
    return browserify({
        basedir:"",
        debug:true,
        entries:["src/main.ts"],
        cache:{},
        packageCache:{}
    }).plugin(tsify)
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest("dist"));
}))
```
修改了default任务，让它使用tsify插件调用Browserify，而不是gulp-typescript。 方便的是，两者传递相同的参数对象到TypeScript编译器。

调用bundle后，我们使用source（vinyl-source-stream的别名）把输出文件命名为bundle.js。

注意，我们为Broswerify指定了debug: true。 这会让tsify在输出文件里生成source maps。 source maps允许我们在浏览器中直接调试TypeScript源码，而不是在合并后的JavaScript文件上调试。 你要打开调试器并在main.ts里打一个断点，看看source maps是否能工作。 当你刷新页面时，代码会停在断点处，从而你就能够调试greet.ts。

3. 修改src/index.html中的的js文件引用

此时，应该引用 ./boundle.js

4. 运行命令 gulp
```
gulp
```

5. 观察./dist/bundle.js

bundle.js
```
(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function sayHello(name) {
    return "Hello from " + name;
}
exports.sayHello = sayHello;
},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var greet_1 = require("./greet");
console.log(greet_1.sayHello("Typescript"));
},{"./greet":1}]},{},[2])

```

6. 打开dist/index.html文件
你应该可以在控制台中看到正确的输出了。


### 自动构建

在编辑保存.ts时，能立即看到效果。

#### 安装watchify包
```
npm install --save-dev watchify gulp-util
```
Watchify启动Gulp并保持运行状态，当你保存文件时自动编译。 帮你进入到编辑-保存-刷新浏览器的循环中。

#### 修改gulpfile.js配置

共有三处改变，但是需要你略微重构一下代码。

(1) 将browserify实例包裹在watchify的调用里，控制生成的结果。
(2) 调用watchedBrowserify.on("update", bundle);，每次TypeScript文件改变时Browserify会执行bundle函数。
(3) 调用watchedBrowserify.on("log", gutil.log);将日志打印到控制台。


(1)和(2)在一起意味着我们要将browserify调用移出default任务。 然后给函数起个名字，因为Watchify和Gulp都要调用它。 (3)是可选的，但是对于调试来讲很有用。

```
let gulp = require("gulp")

let browserify =require("browserify")
let source = require("vinyl-source-stream")
let tsify = require("tsify");
let watchify = require("watchify")
let gutil = require("gulp-util")

var wathchedBrowerify = watchify(browserify({
    basedir:"",
    debug:true,
    entries:["src/main.ts"],
    cache:{},
    packageCache:{}
})).plugin(tsify)

let paths = {
    pages:["src/*.html"]
}
gulp.task("copy-html",function(){
    return gulp.src(paths.pages).pipe(gulp.dest("dist"))
});
function bundle(){
    return wathchedBrowerify.bundle().pipe(source('bundle.js'))
    .pipe(gulp.dest("dist"));
}
gulp.task("default",gulp.series("copy-html",bundle));

wathchedBrowerify.on("update",bundle);
wathchedBrowerify.on("log",gutil.log)
```

### 浏览器自动刷新

#### 安装 live-server
live-server与我们上面介绍的typescript，gulp都没有关系。 你只需要全局安装live-server。然后进入dist目录，运行live-server即可看到效果。

它的[npm地址](https://www.npmjs.com/package/live-server)
```
npm install -g live-server
cd dist
live-server
```

## 在gulp中使用less

### 准备好目录

dist/css

src/less

### 安装gulp-less包
```
npm install gulp-less --dev
```

### 修改gulpfile配置
```
let gulp = require("gulp")

let browserify =require("browserify")
let source = require("vinyl-source-stream")
let tsify = require("tsify");
let watchify = require("watchify")
let gutil = require("gulp-util")

const less = require('gulp-less')

var wathchedBrowerify = watchify(browserify({
    basedir:"",
    debug:true,
    entries:["src/main.ts"],
    cache:{},
    packageCache:{}
})).plugin(tsify)

let paths = {
    pages:["src/*.html"]
}

gulp.task('less', function () {
    return gulp.src('src/less/**/*.less')
      .pipe(less())
      .pipe(gulp.dest('dist/css'));
  });

gulp.task("copy-html",function(){
    return gulp.src(paths.pages).pipe(gulp.dest("dist"))
});
function bundle(){
    return wathchedBrowerify.bundle().pipe(source('bundle.js'))
    .pipe(gulp.dest("dist"));
}
gulp.task("default",gulp.series("copy-html","less",bundle));

gulp.watch(['src/less/*.less','src/index.html'], gulp.series('less','copy-html'));

wathchedBrowerify.on("update",bundle);
wathchedBrowerify.on("log",gutil.log)

```


## end
至此，我们搭建一个可以写ts代码，并在浏览器环境中运行的开发环境。





















