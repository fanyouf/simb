# 如何调试 node 代码

## node 代码

代码: `node --inspect index.js`

.vscode 中会自动产生一个 launch.json 文件

```
{
    // 使用 IntelliSense 了解相关属性。
    // 悬停以查看现有属性的描述。
    // 欲了解更多信息，请访问: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "启动程序",
            "program": "${workspaceFolder}/index.js"
        }
    ]
}
```

加上断点，就可以在 vscode 的调试面板中查看效果了。

## 浏览器中调试

```
node --inspect server.js
```

会输出

```
Debugger listening on ws://127.0.0.1:9229/845f1fd0-2ff2-45d6-bcfe-246b085700b1
For help see https://nodejs.org/en/docs/inspector
```

复制`127.0.0.1:9229/json`到浏览器中,可以看到如下：

```
[ {
  "description": "node.js instance",
  "devtoolsFrontendUrl": "chrome-devtools://devtools/bundled/inspector.html?experiments=true&v8only=true&ws=127.0.0.1:9229/845f1fd0-2ff2-45d6-bcfe-246b085700b1",
  "faviconUrl": "https://nodejs.org/static/favicon.ico",
  "id": "845f1fd0-2ff2-45d6-bcfe-246b085700b1",
  "title": "server.js",
  "type": "node",
  "url": "file:///Users/fanyoufu/传智播客/fanyoufu/01-ajax/代码/nativeServer/server.js",
  "webSocketDebuggerUrl": "ws://127.0.0.1:9229/845f1fd0-2ff2-45d6-bcfe-246b085700b1"
} ]
```

两种方式去开始浏览器中调试：

- 直接在浏览器中输入：chrome://inspect/#devices
  可能需要去端口与 ip 地址进行配置了。

- 上面的 json 中 chrome-devtools 复制，直接在浏览器中输入。
  在 sources 中，你可能什么也看不到，不要紧，通过 open 命令，输入在 node 中写的文件名，再回车，你就可以看到你的 node 中的文件了。然后，正常通过 chrome 浏览器进行调试。
