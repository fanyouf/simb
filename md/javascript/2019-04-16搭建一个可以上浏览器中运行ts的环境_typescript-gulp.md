# 搭建一个可以在浏览器环境中运行ts的环境

在学习typescript中过程中我们遇到的第一个问题就是在哪去运行ts代码（不像js可以直接在浏览器中运行，ts需要先进行编译，转成js代码之后，才能运行。），我最提供一个最简单的环境来运行ts代码，所以本文从零开始介绍了如何去搭建在浏览器环境下使用ts编写代码的环境。

整体分成如下几步：

- 建立基本目录
- 安装依赖
- 修改配置
- 验收效果

## 建立目录结构

```
package.json
src/
dist/
```

建议使用 `npm init ` 来初始化 `package.json` 文件。

其中 src 就是用来存放ts文件，dist是编译之后的文件。

## 安装 gulp 和 typescript

1. 全局安装 gulp

```
npm install -g gulp-cli
```

2. 安装 typescript，gulp 和 gulp-typescript 到开发依赖项。

```
npm install --save-dev typescript gulp gulp-typescript
```

- typescript 是 `typescript `的编译器，它用来把ts编译成js
- gulp-typescript 是与 gulp 配合使用的 gulp 插件

## 通过gulp命令来编译第一个ts文件

### 写第一个ts 文件

把在/src下新建main.ts文件，内容如下：

```
function hello(compiler: string) {
    console.log(`Hello from ${compiler}`);
}
hello("TypeScript");
```

### 配置 tsconfig 文件

在项目根目录下建立 tsconfig.json 文件。

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

### 配置 gulpfile.js 文件

在项目目录下建立 gulpfile.js 文件，来配置 gulp 命令

> 目录/gulpfile.js 文件

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

### 运行 gulp 命令，查看效果

```
gulp
```

- gulp 命令通过 gulpfile.js 的配置，把 src/main.ts 编译成 dist/main.js 文件。
  此时在 dist 下会生成一个 main.js 文件，其文件的内容是：

```
function hello(compiler) {
    console.log("hello from " + compiler);
}
hello("TypeScript");
```

你可以回过去对比看看` src/main.ts` 的内容和现在的 `dist/main.js` 的内容对比。接下来通过node 命令来执行我们生成的main.js文件。

```javascript
node dist/main.js
```

- node dist/main.js 命令是在 node 环境中执行 main.js

以上是在 node 中执行 javascript，那如何把 javascript 放在浏览器中执行呢？
其实你可以直接把这个 main.js 引入到你的 html 页面中。

## 通过gulp命令来编译多个ts文件

现实中的项目目录肯定会有很多个模块，表现在多个单纯的文件中。下面来尝试一下：

共三步.

###  新建一个greet.ts 文件：

 在`src/greet.ts` 中，具体的代码如下：

```
export function sayHello(name: string) {
    return `Hello from ${name}`;
}
```

### 在src/main.ts 代码引入 greet.ts 

修改src/main.ts文件如下：

```
import { sayHello } from "./greet";
console.log(sayHello("TypeScript"));
```

### 将 src/greet.ts 添加到 tsconfig.json

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

注意：files 的值是一个数组，数组中最后一个元素不要加“,”。如果你加了，有可能会在接下来的任务中出错。

### 运行gulp命令，对main.js进行编译

确保执行 gulp 后模块是能工作的，在 Node.js 下进行测试：

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

注意，此时，你如果直接在.html 文件中引用 dist/main.js 文件是会出错误的。原因是：浏览器中不认识 require 命令。 而在 node 环境是可以执行 node main.js 的，因为 node 支持 commonJS 的模块化。

我们来证明这一点。

## 在浏览器环境中使用 main.js

### 创建 src/index.html 文件

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

### 从 src 目录中拷贝index.htm到 dist 目录

为什么不直接在 dist 目录下创建这个 index.html 文件，而非要在 src 目录下创建好了再复制过去呢？ 因为 src 是源目录，dist 是生产目录，我们只能把代码写在源目录中。

这个拷贝的过程是通过建立 gulp 任务来完成的

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

这里增加了 copy-html 任务并且把它加作 default 的依赖项。 这样，当 default 执行时，copy-html 会被首先执行。

注意：default 是默认任务，而第二个参数 gulp.series()这种写法是 gulp4.0 的写法。gulp3.0 的写法有个一点小区别。请大家根据自己 gulp 的版本来决定。

改造完 gulpfile.js 后，再次运行

```
gulp
```

可以看这个两个任务的结果:

1. index.html 拷贝到了 dist 目录
2. main.ts,greet.ts 被编译成了对应的.js 文件。

### 浏览器中的 export 错误

此时，我们通过浏览器打开 index.html 文件，你会在浏览器中看到错误信息：

```
main.js:2 Uncaught ReferenceError: exports is not defined
    at main.js:2
```

那么，如何解决呢？

## 工程由 Node.js 环境移到浏览器环境里

现在，让我们把这个工程由 Node.js 环境移到浏览器环境里。 通过 Browserify 把所有模块捆绑成一个 JavaScript 文件。

### 安装依赖

```
npm install --save-dev browserify tsify vinyl-source-stream
```

首先，安装 Browserify，tsify 和 vinyl-source-stream。 tsify 是 Browserify 的一个插件，就像 gulp-typescript 一样，它能够访问 TypeScript 编译器。 vinyl-source-stream 会将 Browserify 的输出文件适配成 gulp 能够解析的格式，它叫做 vinyl。

### 修改 gulpfile.js 配置

几个要点：

1. 使用 browserify 处理 typescript 文件的插件 tsify 来代替 gulp-typescript
2. 配置 browserify()打包.js 文件到 bundle.js

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

修改了 default 任务，让它使用 tsify 插件调用 Browserify，而不是 gulp-typescript。 方便的是，两者传递相同的参数对象到 TypeScript 编译器。

调用 bundle 后，我们使用 source（vinyl-source-stream 的别名）把输出文件命名为 bundle.js。

注意，我们为 Broswerify 指定了 debug: true。 这会让 tsify 在输出文件里生成 source maps。 source maps 允许我们在浏览器中直接调试 TypeScript 源码，而不是在合并后的 JavaScript 文件上调试。 你要打开调试器并在 main.ts 里打一个断点，看看 source maps 是否能工作。 当你刷新页面时，代码会停在断点处，从而你就能够调试 greet.ts。

3. 修改 src/index.html 中的的 js 文件引用

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

6. 打开 dist/index.html 文件
   你应该可以在控制台中看到正确的输出了。

## 自动构建

如果希望在编辑保存.ts 时，能立即在浏览器看到效果，我们可以引入watchify来实现这一点。

#### 安装 watchify 包

```
npm install --save-dev watchify gulp-util
```

Watchify 启动 Gulp 并保持运行状态，当你保存文件时自动编译。 帮你进入到编辑-保存-刷新浏览器的循环中。

#### 修改 gulpfile.js 配置

共有三处改变，但是需要你略微重构一下代码。

(1) 将 browserify 实例包裹在 watchify 的调用里，控制生成的结果。
(2) 调用 watchedBrowserify.on("update", bundle);，每次 TypeScript 文件改变时 Browserify 会执行 bundle 函数。
(3) 调用 watchedBrowserify.on("log", gutil.log);将日志打印到控制台。

(1)和(2)在一起意味着我们要将 browserify 调用移出 default 任务。 然后给函数起个名字，因为 Watchify 和 Gulp 都要调用它。 (3)是可选的，但是对于调试来讲很有用。

修改之后的代码如下：

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

## 浏览器自动刷新

### 安装 live-server

live-server 与我们上面介绍的 typescript，gulp 都没有关系。 你只需要全局安装 live-server。然后进入 dist 目录，运行 live-server 即可看到效果。

它的[npm 地址](https://www.npmjs.com/package/live-server)

```
npm install -g live-server
cd dist
live-server
```

## 在 html 中使用 less

在写页面时，不可避免地要用到css预编译工具，以less为例进行介绍，大家也可以同理拓展到其它的语言中。基本步骤是：

- 安装less包
- 修改gulp配置文件

### 准备好目录

dist/css

src/less

### 安装 gulp-less 包

由于我们的工程化使用gulp工具，所以直接本地安装gulp-less即可。

```
npm install gulp-less --dev
```

### 修改 gulpfile 配置

把less转css的工作，写入gulp任务。

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

## 总结

至此，我们搭建一个可以写 ts 代码，并在浏览器环境中运行的开发环境。它可以

- 即时编译ts代码 
- 浏览器自动刷新
- 支持less