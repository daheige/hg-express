//路由设置
function RunApiRouter(app) {
    app.get('/', (req, res) => res.send('Hello World!'))
    app.get('/info', (req, res) => {
        res.json({
            "code": 200,
            "message": "ok",
            "data": {
                "id": 1,
                "username": "daheige",
                "age": 29,
            }
        });
    })

    app.get("/test", (req, res) => {
        res.send("ok")
    })

    app.post("/test", (req, res) => {
        res.json([{
            "id": 1,
            "username": "daheige",
            "age": 28,
        }, {
            "id": 2,
            "username": "nodejs",
            "age": 23,
        }]);
    })
}

module.exports = RunApiRouter