# 如何去生成自己的 xxx-cli 命令

## 背景

你积累了一些前端工程代码，希望这些工程代码能够复用。 比如说，为了学习使用 typescript，我们在本地使用 gulp,typescript,browerify,live-server 等工具搭建了一个学习环境。

现在，你如果把这个学习环境提供给其他小伙伴使用？

## 如何复用代码

复用代码给出三个选择：

1. 纯文件分享。

例如，共享在百度云中。下次要使用时，直接 copy 下来，改改目录名，工程名。

2. npm 包。

在创建好前端项目之后，通过 npm install XXX 的方式把代码拉下来，保存在 node_modules 中。通过 import 的方式使用代码。

3. npm-cli 命令行

   具体使用方式是：

```
npm instill -g XXXX;
XXXX 命令 参数
```

典型的代码有 vue-cli, @vue-cli create-react-app 等等。

常见的 vue-cli, @vue-cli create-react-app 等等。这种方式好处在于允许用户做一定的交互选择，或者设置。 例如，你在通过 vue-cli 命令去创建项目时，还是允许用户去设置自己的项目名字，开发时使用的一些参数等等。

显然，第三种方法更加的灵活：它不像第一，二种只是单纯的复制粘贴代码。

## 基本步骤

1.  在 github 上创建代码库(下午以 my-cli 为例)。
2.  在本地以 npm 包的方式开发。
3.  开发完成后，打包上传到 npm。
4.  其他用户通过 npm install -g my-cli 的方式安装到本地。
5.  在本地运行 my-cli create ，来创建一个初始项目。

### 让你的项目支持命令行

1.  在 package.json 中设置 bin 选项。

```
{
    "bin" : { "my-cli" : "./cli.js" }
}
```

更多参考[bin](!https://docs.npmjs.com/files/package.json#bin) 。上面的`my-cli`就是我们后面要使用的命令的名字，这里，我故意把它设置成这个包的名字。

2.  创建 bin/cli.js 文件

在项目根目录下，创建 bin/cli.js 文件。其中，目录结构如下：

```
my-cli
    -bin
        -cli.js
    -package.json
```

3.  编写 bin/cli.js 中的代码如下：

```
#!/usr/bin/env node
console.info("hello my-cli !")
```

特别注意第一句： `#!/usr/bin/env node`

4.  本地加载这个包
    在项目目录下运行 `npm install -g` , 这样就可以直接把这个包全局安装在本地了。

```
 npm install -g
```

切换到其他的目录下。你试着在控制台中运行：

```
my-cli
```

就会看到控制台的输出了。

为啥？
我们知道，如果在控制台中直接输入 my-cli 还不报错，说明，my-cli 已经写入了环境目录下。在控制台中运行 `set` 命令，查看当前的环境变量。
你会发现`C:\Users\用户名\AppData\Roaming\npm`这个路径存在于环境变中。这就意味着你在控制台中输入的命令名，会在这个目录中去找，我们设置了`bin`这个属性，所以在全局安装时，已经加入了这个`my-cli`命令在环境变量所指向的目录中。这就是为什么你可以在控制台中直接输入`my-cli`命令来调用`my-cli/bin/cli.js` 文件了。

接下来，就需要我们在 cli.js 中具体来做一些工作了。
