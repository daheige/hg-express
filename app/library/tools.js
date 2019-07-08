const uuidLib = require("node-uuid");
const fs = require('fs');
const crypto = require('crypto');
const querystring = require('querystring');

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
    parseParams: function(params = {}) {
        if (typeof params == 'object' && Object.keys(params).length) {
            params = querystring.stringify(params);
        } else if (typeof params == 'string' && params) {
            params = encodeURIComponent(params);
        } else {
            params = querystring.stringify(params);
        }

        return params;
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
    }
};

module.exports = libs;