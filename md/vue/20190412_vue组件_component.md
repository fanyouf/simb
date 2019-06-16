## 组件之间相互转递数据

先要确定一点，数据是在哪里产生的？这个问题很关键，它是会直接影响我们如何去设计组件的结构。

我建议的答案是：数据是从上级组件中产生，然后流向下级。举个例子：

ad

```
<my-header>
    <div>
        .....
    </div>
    <my-vator></my-vator>
</my-header>
```

这里有一个组件的嵌套关系：my-header> my-vator 。我们需要在 my-vator 上显示用户的头像，用户名等信息。 这是一个典型的应用场景，现在的问题是：数据（用户基本信息）是在哪个组件中产生的。

- A : 父级组件 my-header
- B : 子组件 my-vator

如果选择 A, 意味着则 my-vator 组件就是一个纯用来展示信息的组件：给他什么信息，它就显示什么。它自己不能产生数据。

如果选择 B, 意味着 my-vaotr 可以自己去发请求，去得到数据，显示数据，它完全是自给自足的。你把它放在任何的地方，它就可以自己独立的工作。

看你决定怎么选择。 我选择 A： 一切数据都从父级组件中获取，子组件只是消费数据。

| 从  | 哪里   | 传递到   | 是否改状态         | 是否回传状态 |
| --- | ------ | -------- | ------------------ | ------------ |
| 1   | 父组件 | ->子组件 | 子组件内部不改状态 | 否           |
| 2   | 父组件 | ->子组件 | 子组件内部改状态   | 是           |
| 3   | 子组件 | ->父组件 | 子组件内部改状态   | 是           |

```




<div>
    <son-component @myevent="hEvent"></son-component>
</div>


Vue.component("son-component", {
    tempalte:"<div><input v-model='msg'><button @click='hClick'>ok</button></div>",
    data:function(){
        return {msg:"init value"}
    },
    methods:{
        hClick(){
            this.$emit("myevent",this.msg)
        }
    }
})
```

\$emit
