# express 实战

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

# 项目 npm 初始化

    请执行 yarn install 安装必要的npm

# 开始运行

    npm install
    node main.js
    访问localhost:3000

# 采用 pm2 部署

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

# 压力测试报告

    查看nodejs版本
    $ node -v
        v12.10.0

    单个进程跑，node main.js
    $ wrk -t 8 -c 100 -d 1m http://localhost:1337/api/info
    Running 1m test @ http://localhost:1337/api/info
    8 threads and 100 connections
    Thread Stats   Avg      Stdev     Max   +/- Stdev
        Latency    53.02ms    8.80ms 121.49ms   84.93%
        Req/Sec   227.23     44.04   363.00     79.02%
    108672 requests in 1.00m, 53.79MB read
    Requests/sec:   1809.44
    Transfer/sec:      0.90MB
    当请求大了之后，每个请求响应时间大概220ms以上

    pm2启动，进行压力测试
    $ pm2 start boot.json --env production

    查看pm2 list
    $ pm2 list
    ┌────────────┬────┬─────────┬────────┬───┬──────┬───────────┐
    │ Name       │ id │ mode    │ status │ ↺ │ cpu  │ memory    │
    ├────────────┼────┼─────────┼────────┼───┼──────┼───────────┤
    │ hg-express │ 0  │ cluster │ online │ 0 │ 0.7% │ 44.1 MB   │
    │ hg-express │ 1  │ cluster │ online │ 0 │ 0.8% │ 43.2 MB   │
    │ hg-express │ 2  │ cluster │ online │ 0 │ 0.7% │ 43.5 MB   │
    │ hg-express │ 3  │ cluster │ online │ 0 │ 0.7% │ 43.0 MB   │
    │ hg-express │ 4  │ cluster │ online │ 0 │ 0.7% │ 43.3 MB   │
    │ hg-express │ 5  │ cluster │ online │ 0 │ 1.2% │ 42.6 MB   │
    │ hg-express │ 6  │ cluster │ online │ 0 │ 1.9% │ 45.9 MB   │
    │ hg-express │ 7  │ cluster │ online │ 0 │ 1.9% │ 45.8 MB   │
    │ hg-express │ 8  │ cluster │ online │ 0 │ 2.9% │ 43.1 MB   │
    │ hg-express │ 9  │ cluster │ online │ 0 │ 3.8% │ 42.9 MB   │
    └────────────┴────┴─────────┴────────┴───┴──────┴───────────┘
    Use `pm2 show <id|name>` to get more details about an app
    压力测试
    $ wrk -t 8 -c 100 -d 1m http://localhost:1337/api/info
    Running 1m test @ http://localhost:1337/api/info
    8 threads and 100 connections
    Thread Stats   Avg      Stdev     Max   +/- Stdev
        Latency    56.16ms   75.76ms   1.99s    91.08%
        Req/Sec   272.76    119.66     0.87k    61.39%
    128984 requests in 1.00m, 63.84MB read
    Socket errors: connect 0, read 0, write 0, timeout 18
    Requests/sec:   2146.46
    Transfer/sec:      1.06MB
    平均每个请求大概270ms以上

    综合比较，nodejs在大量的请求过来的时候，请求时间变长
    $  cat /proc/cpuinfo | grep name | cut -f2 -d: | uniq -c
      4  Intel(R) Core(TM) i5-2450M CPU @ 2.50GHz
    压力测试结果 1800-2200qps/s

    同样的接口，go-api压力测试，可以看github.com/daheige/go-api代码
    压力测试/api/info接口

    $ wrk -t 8 -c 100 -d 1m --latency http://localhost:1338/api/info
    Running 1m test @ http://localhost:1338/api/info
    8 threads and 100 connections
    Thread Stats Avg Stdev Max +/- Stdev
    Latency 21.69ms 48.75ms 604.71ms 97.39%
    Req/Sec 833.19 149.83 1.76k 78.02%
    Latency Distribution
    50% 15.34ms
    75% 18.86ms
    90% 29.00ms
    99% 317.16ms
    391027 requests in 1.00m, 69.73MB read
    Requests/sec: 6507.18
    Transfer/sec: 1.16MB
    平均每个请求 15-30ms 处理完毕

    可以看出同等的资源，golang执行效率是nodejs的2-4倍左右

# 版权

    MIT
    该项目属于个人项目，未经同意，不得私自转载和肆意传播，以及用于商业项目用途
