# express实战
    基于express4.x封装而成的nodejs api框架，可用于大型项目的api开发。

# 目录结构
    .
    ├── app
    │   ├── controller      控制器
    │   ├── library         公共函数
    │   ├── middleware      中间件
    │   └── routes          路由
    ├── config              配置文件
    │   ├── index.js
    │   └── redis.js
    ├── LICENSE
    ├── logs                日志目录
    │   └── 2019-7-8.log
    ├── main.js             nodejs入口文件
    ├── node_modules        npm依赖包
    ├── package.json

# 项目npm初始化
    请执行 yarn install 安装必要的npm

# 开始运行
    npm install
    node main.js
    访问localhost:3000

# 采用pm2部署
    线上boot.json配置，可以指定node运行的端口
    1、初始化logs
       sh bin/app-init.sh
    2、pm2启动程序
        测试环境: pm2 start boot.json --env testing
        生产环境: pm2 start boot.json --env production
        开发环境: pm2 start boot.json --env dev
    应用重启：
        pm2 restart hg-express
    查看日志： pm2 logs hg-express
    查看性能指标： pm2 show hg-express
    查看cpu: pm2 monit

# 版权
    MIT
    该项目属于个人项目，未经同意，不得私自转载和肆意传播，以及用于商业项目用途
    