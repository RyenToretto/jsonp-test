const express = require('express');

const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));

// 原生 ajax 的 get 路由
app.get("/platform/statistics", (request, response)=>{
    console.log('10');
    //获取请求参数
    const {callback, AK, topicId} = request.query;

    console.log('service receive' + topicId);
    console.log(AK);

    const data = {
        status: 200,
        message: '服务器响应的数据',
        data: {
            topicId: 'service receive ' + topicId,
            AK: 'service receive ' + AK
        }
    };    // 要响应给浏览器的数据

    response.send(`${callback}(${JSON.stringify(data)})`);
    // getData(name: 'postResponse', age: 18)
    // 被 浏览器 请求过去，然后执行了。间接获取了响应数据
    // 必须要 将 对象转化为 JSON 字符串数据，然后被浏览器 解析成 JSON 对象。否则报错
});

/**************** 端口号 3000, 启动服务器 ***************/
app.listen(3000, err=>console.log(err?err:'\n\n服务器已启动: http://localhost:3000/index.html\n\t\tHunting Happy!'));

