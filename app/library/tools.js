const crypto = require('crypto');
const querystring = require('querystring');
const axios = require('axios'); //axios库
const uuidLib = require('node-uuid');
const fs = require('fs');

//日志级别从低到高
const logLevel = {
    debug: 100,
    info: 200,
    notice: 250,
    warn: 300,
    error: 400,
    crit: 500, //临界值错误: 超过临界值的错误
    alter: 550, //警戒性错误: 必须被立即修改的错误
};

//用于md5加密字符串
function md5(str) {
    str = String(str);
    return crypto.createHash('md5').update(str).digest('hex');
}

function zeroNum(num) {
    return num > 10 ? num : '0' + num;
}

function writeLog(msg = {}, context = {}, level = "info") {
    if (msg == null || msg == '') {
        console.log("write data: ", msg);
        return;
    }

    if (!fs.existsSync(config.log_dir)) {
        fs.mkdirSync(config.log_dir);
    }

    //日志文件
    let myDate = new Date();
    let logFile = [myDate.getFullYear(), myDate.getMonth() + 1, myDate.getDate()].join('-') + '.log';
    //2018-09-09 09:09:09
    let currentTime = [
        myDate.getFullYear(),
        zeroNum(myDate.getMonth() + 1),
        zeroNum(myDate.getDate()),
    ].join('-') + ' ' + [
        zeroNum(myDate.getHours()),
        zeroNum(myDate.getMinutes()),
        zeroNum(myDate.getSeconds())
    ].join(':');

    let ms = myDate.getTime();
    myDate = null;

    //异步写入文件中
    fs.writeFile(config.log_dir + '/' + logFile, JSON.stringify({
        code: !logLevel[level] ? logLevel.info : logLevel[level],
        message: msg,
        context: context || {},
        localTime: currentTime,
        msTime: ms,
    }) + '\n', {
        encoding: 'utf8',
        flag: 'a',
    }, function(err) {
        if (err) {
            console.log('write log file error: ', err);
            return;
        }

        console.log('write log success!');
    });
}

let libs = {
    uuid: function() {
        return uuidLib.v4();
    },
    md5: md5,
    zeroNum: zeroNum,
    log: writeLog,
    /*======================日志处理==========*/
    debugLog: function(data = {}, context = {}) {
        writeLog(data, context, 'debug');
    },
    infoLog: function(data = {}, context = {}) {
        writeLog(data, context, 'info');
    },
    warnLog: function(data = {}, context = {}) {
        writeLog(data, context, 'warn');
    },
    noticeLog: function(data = {}, context = {}) {
        writeLog(data, context, 'notice');
    },
    errorLog: function(data = {}, context = {}) {
        writeLog(data, context, 'error');
    },
    critLog: function(data = {}, context = {}) {
        writeLog(data, context, 'crit');
    },
    alterLog: function(data = {}, context = {}) {
        writeLog(data, context, 'alter');
    },
    formatParams: function(params = {}) {
        if (typeof params == 'object' && Object.keys(params).length) {
            params = querystring.stringify(params);
        } else if (typeof params == 'string' && params) {
            params = encodeURIComponent(params);
        } else {
            params = querystring.stringify(params);
        }

        return params;
    },
    //get请求，返回结果是一个promise
    //请求参数params必须是一个对象
    //返回结果是一个promise
    get: function(baseUrl = '', url = '', params = {}, headers = {}) {
        if (url == null || url == '') {
            return new Promise(function(resolve, reject) {
                reject({
                    status: 500,
                    message: 'url不能为空',
                    data: null,
                });
            });
        }

        //请求参数设置
        let options = {
            method: "GET",
            params: params || {},
            timeout: 2000,
        };

        //baseUrl设置
        if (baseUrl != '' && baseUrl != null) {
            options.baseURL = baseUrl;
        }

        //自定义header头
        if (Object.keys(headers).length) {
            options.headers = headers;
        }

        //创建一个实例
        let instance = axios.create(options);
        return instance.get(url);
    },
    //请求参数params必须是一个对象
    post: function(baseUrl = '', url = '', params = {}, headers = {}) {
        if (url == null || url == '') {
            return new Promise(function(resolve, reject) {
                reject({
                    status: 500,
                    message: 'url不能为空',
                    data: null,
                });
            });
        }

        //请求参数设置
        let options = {
            method: "POST",
            data: params || {},
            timeout: 2000,
        };

        //baseUrl设置
        if (baseUrl != '' && baseUrl != null) {
            options.baseURL = baseUrl;
        }

        //请求头设置
        options.headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
        }

        //自定义header头
        let opt = Object.keys(headers);
        let optLen = opt.length;
        if (optLen) {
            for (let i = 0; i < optLen; i++) {
                let k = opt[i];
                options.headers[k] = headers[k];
            }
        }

        console.log("====current options===", options)
        console.log("====request uri====", url)

        //创建一个实例，这里需要吧options传递进入
        let instance = axios.create(options);
        let res = instance.post(url); //返回结果是一个promise
        /* res.then(function(data) {
             console.log(data);
         }).catch(function(err) {
             console.log('res error: ', err)
         })*/

        return res;
    }
};

module.exports = libs;