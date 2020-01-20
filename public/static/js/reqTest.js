/**
 * @file  封装 jsonp 和 原生 ajax
 * @author v_koujianfeng
 */

(function () { // 点透（传透）
    const showConsole = true;
    function bindEventFunction(obj, eventStr, func) {
        // console.log(!!obj.addEventListener == true);    // true
        // console.log(!!obj.attachEvent == true );    // false
        if (obj.addEventListener) {
            // 大多数浏览器支持, IE8 及以下不支持
            obj.addEventListener(eventStr, func, false); // false 指定在捕获的阶段的时候不触发事件
        } else {
            // IE5 - IE10 支持
            obj.attachEvent('on' + eventStr, function () {
                func().call(obj);
            });
        }
    }

    // 格式化参数
    function formatParams(data) {
        let arr = [];
        for (let name in data) {
            arr.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]));
        }

        // 添加一个时间戳，防止缓存
        let timestamp = new Date().getTime();
        arr.push('timestamp=' + timestamp);
        return arr.join('&');
    }

    function diyHttpRequest(configObj) {
        let paramObj = configObj || {};
        paramObj.data = paramObj.data || {};

        // jsonpRequest 请求
        function jsonpRequest(paramObj) {
            // 创建 script 标签并加入到页面中
            let callbackName = paramObj.jsonpFunc;
            let head = document.getElementsByTagName('head')[0];

            // 设置传递给后台的回调参数名
            paramObj.data['callback'] = callbackName;
            let data = formatParams(paramObj.data);
            let script = document.createElement('script');
            head.appendChild(script);

            // 创建jsonp回调函数
            window[callbackName] = function(jsonStr) {
                head.removeChild(script);
                clearTimeout(script.timer);
                window[callbackName] = null;
                paramObj.success && paramObj.success(jsonStr);
            };

            // 发送请求
            script.src = paramObj.url + '?' + data;

            // 为了得知此次请求是否成功，设置超时处理
            if (paramObj.time) {
                script.timer = setTimeout(function() {
                    window[callbackName] = null;
                    head.removeChild(script);
                    paramObj.error && paramObj.error({
                        message: '超时'
                    });
                }, paramObj.time);
                return {
                    status: 200,
                    message: 'jsonp 请求成功',
                    data: true
                }
            } else {
                return {
                    status: 200,
                    message: 'jsonp 请求失败',
                    data: false
                }
            }
        }

        // ajax 请求
        function diyAjax(paramObj) {
            // 请求方式，默认是GET
            paramObj.type = (paramObj.type || 'GET').toUpperCase();

            // 避免有特殊字符，必须格式化传输数据
            paramObj.data = formatParams(paramObj.data);
            let xmlHttpObj = null;

            /* 创建XMLHttpRequest对象，
                老版本的 Internet Explorer（IE5 和 IE6）使用 ActiveX 对象：new ActiveXObject("Microsoft.XMLHTTP")
             */
            if (window.XMLHttpRequest) {
                xmlHttpObj = new window.XMLHttpRequest();
            } else if (window.ActiveXObject) { // IE6及其以下版本
                xmlHttpObj = new window.ActiveXObject('Microsoft.XMLHTTP');
            }
            /* 判断是否支持请求 */
            if (xmlHttpObj == null) {
                console.log('你的浏览器不支持XMLHttp');
                return 0;
            }

            // 监听事件，只要 readyState 的值变化，就会调用 readystatechange 事件
            xmlHttpObj.onreadystatechange = function() {
                // readyState 属性表示请求/响应过程的当前活动阶段，4为完成，已经接收到全部响应数据
                if (xmlHttpObj.readyState === 4) {
                    let status = xmlHttpObj.status;
                    // status：响应的 HTTP 状态码，以 2 开头的都是成功
                    if (status >= 200 && status < 300) {
                        let response = '';
                        // 判断接受数据的内容类型
                        let type = xmlHttpObj.getResponseHeader('Content-type');
                        if (type.indexOf('xml') !== -1 && xmlHttpObj.responseXML) {
                            response = xmlHttpObj.responseXML; // Document 对象响应
                        } else if (type === 'application/json') {
                            response = JSON.parse(xmlHttpObj.responseText); // JSON 响应
                        } else {
                            response = xmlHttpObj.responseText; // 字符串响应
                        }
                        // 成功回调函数
                        paramObj.success && paramObj.success(response);
                    } else {
                        paramObj.error && paramObj.error({
                            status,
                            message: '数据异常',
                            data: false
                        });
                    }
                }
            };

            // 连接和传输数据
            if (paramObj.type === 'GET') {
                // 三个参数：请求方式、请求地址(get方式时，传输数据是加在地址后的)、是否异步请求(同步请求的情况极少)；
                xmlHttpObj.open(paramObj.type, paramObj.url + '?' + paramObj.data, true);
                xmlHttpObj.send(null);
            } else {
                xmlHttpObj.open(paramObj.type, paramObj.url, true);
                // 必须，设置提交时的内容类型
                xmlHttpObj.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
                // 传输数据
                xmlHttpObj.send(paramObj.data);
            }
        }

        // 判断是ajax请求还是jsonp请求
        return paramObj.isJsonp ? jsonpRequest(paramObj) : diyAjax(paramObj);
    }

    bindEventFunction(document.getElementById('btn'), 'click', (e) => {
        // const e = e || window.event;
        showConsole && diyHttpRequest({
            time: 5000,
            isJsonp: true, // 必传，到底是发 jsonp 请求，还是原生 ajax 请求
            jsonpFunc: 'jsonpFunc',
            type: 'GET',
            url: 'http://localhost:3000/jsonp',
            data: {
                diyParam1: 'diyParam1',
                diyParam2: 'diyParam2'
            },
            success: (res) => {
                console.log('成功：处理业务逻辑');
                console.log(res);
            },
            error: (errInfo) => {
                console.log('失败：处理错误');
                console.log(errInfo);
            }
        });
    });
})();
/*
    {
        url    'test.php',  // 请求地址
        type    'POST',  // 请求类型，默认"GET"，还可以是"POST"
        data    { 'b'    '异步请求'} // 传输数据
        success    func // 请求成功的回调函数
        error: funcError // 请求失败的回调函数
    }
 */
