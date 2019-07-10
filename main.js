const express = require('express')
const app = express()
const rootPath = __dirname;
const appPath = rootPath + "/app"
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const runRouter = require(appPath + "/routes/router");

/*===============app运行环境和端口==========*/
let env_info = {
    NODE_PORT: process.env.NODE_PORT || 1337, //生产环境默认1337
    NODE_ENV: (process.env.NODE_ENV || 'production').toLowerCase(),
}

/*===============定义系统常量===============*/
Object.defineProperty(global, 'ENV_INFO', {
    value: env_info,
    writable: false,
    configurable: false,
});

Object.defineProperty(global, 'APP_ENV', {
    value: env_info.NODE_ENV,
    writable: false,
    configurable: false,
});

Object.defineProperty(global, 'ROOT_PATH', {
    value: rootPath,
    writable: false,
    configurable: false,
});

Object.defineProperty(global, 'APP_PATH', {
    value: appPath,
    writable: false,
    configurable: false,
});

/*=========导入全局配置文件和系统全局函数=======*/
const config = require(ROOT_PATH + '/config/index');
let functions_list = config.functions_list;
global.helper = {}; //将函数挂载在helper命名空间上
for (let i in functions_list) {
    if (functions_list[i]) {
        let fnObj = require(APP_PATH + '/library/' + i);
        for (let func in fnObj) {
            if (typeof fnObj[func] != 'function') {
                continue;
            }

            Object.defineProperty(helper, func, {
                value: fnObj[func],
                writable: false,
                configurable: false,
            });
        }
    }
}

/**=============设置config.xxx========*/
delete config.functions_list; //删除functions_list属性
Object.defineProperty(global, 'config', {
    value: config,
    writable: false,
    configurable: false,
});

//记录操作日志
app.use(async function(req, res, next) {
    let start = new Date();
    //请求开始
    let log_id = helper.uuid();
    let request_id = helper.md5(log_id);

    res.set('x-request-id', request_id);
    helper.infoLog('exec start', {
        log_id: log_id,
        request_id: request_id,
        request_uri: req.originalUrl,
        request_path: req.path,
        request_data: req.method != 'GET' ? req.body : req.query,
        ip: req.ip,
        method: req.method,
        ua: req.get('User-Agent') || '',
    });

    try {
        await next();

        let ms = new Date() - start;
        console.log(`${req.method} ${req.url} - cost:${ms}ms`);

        helper.infoLog('exec end', {
            log_id: log_id,
            request_id: request_id,
            exec_time: ms + 'ms'
        });
    } catch (err) {
        helper.catchPanic(err, req, res, next);
    }
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser()); //cookie解析
app.use(helmet());

//路由设置
runRouter(app);

//路由找不到的情况
// catch 404 and forward to error handler
app.use(async function(req, res, next) {
    let err = new Error('Sorry, we cannot find that!');
    err.status = 404;
    await next(err);
});

// server error handler
app.use(helper.catchPanic);

console.log(ENV_INFO);

//启动main
app.listen(ENV_INFO.NODE_PORT, () => console.log('app listening on port: ' + ENV_INFO.NODE_PORT));