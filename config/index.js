module.exports = {
    default_redis: __dirname + '/redis',
    //需要导入的函数文件
    functions_list: {
        func: 1,
        tools: 1,
    },
    log_dir: ROOT_PATH + '/logs',
    app_domain: "/",
    app_version: "1.0.0",
}