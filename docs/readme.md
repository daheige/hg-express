# 生产环境部署如下
    1.安装nodejs
        cd /usr/local
        wget https://nodejs.org/dist/v10.16.0/node-v10.16.0-linux-x64.tar.xz
        xz -d node-v10.16.0-linux-x64.tar.xz
        tar xvzf node-v10.16.0-linux-x64.tar.gz
        mv node-v10.16.0-linux-x64 nodejs
    2.将nodejs加入环境变量中 vim /etc/profile
        export NODE_HOME=/usr/local/nodejs
        export PATH=$PATH:$NODE_HOME/bin
        source /etc/profile

        建立软连接
        ln -s /usr/local/nodejs/bin/npm /usr/bin/npm
        ln -s /usr/local/nodejs/bin/node /usr/bin/node
    3.安装npm相关的包
        安装taobao cnpm
        $ npm install -g cnpm --registry=https://registry.npm.taobao.org
        $ cnpm install -g yarn
        $ cnpm install -g pm2

        cp hg-express /data/www/
        mkdir /data/logs
        chmod -R 777 /data/logs

        进入hg-express目录，安装依赖包
        yarn install

    4.nginx配置
        # 负载均衡hgkoa
        # 当采用多个ip:port可配置多个
        upstream hg-express {
            #server 127.0.0.1:1335 weight=20 max_fails=2 fail_timeout=10;
            #server 127.0.0.1:1336 weight=20 max_fails=2 fail_timeout=10;
            server 127.0.0.1:1337 weight=80 max_fails=2 fail_timeout=10;
        }

        server {
            listen 80;
            server_name hg-express.com www.hg-express.com;

            #访问日志设置
            access_log /data/logs/hg-express.com-access.log;
            error_log /data/logs/hg-express.com-error.log;
            #error_page 404 /usr/share/nginx/html/40x.html;

            #error_page 500 502 503 504 /50x.html;
            location = /50x.html {
                root /usr/share/nginx/html;
            }

            location @nodejs {
                proxy_http_version 1.1;         #http 版本
                proxy_set_header Host $host;    #为反向设置原请求头
                proxy_set_header X-Read-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header Upgrade $http_upgrade; #设置WebSocket Upgrade
                proxy_set_header Connection "upgrade";
                proxy_set_header X-NginX-Proxy true;
                proxy_set_header X-Request-Uri $request_uri;
                proxy_set_header X-Referer $http_referer;
                proxy_pass http://hg-express;
            }

            location / {
                try_files $uri @nodejs;
            }
        }

    5.同步 hg-express.com，后发生产
        发生产之前，请执行sh bin/app-init.sh
    6.线上运行：
        方式一：采用pm2 进行管理 pm2 start boot.json --env production
        方式二: 将bin/hg-express 复制到/etc/init.d/hg-express 作为系统服务启动
    备注：
        请用普通用户执行pm2进程管理，项目打包上线采用pm2可以做到自动重启服务