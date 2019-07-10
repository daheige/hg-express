//路由设置
const reqWare = require("../middleware/reqWare");
const indexController = require("../controller/index");

function RunApiRouter(app) {
    app.use(reqWare.setHeader)
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

    //path-controller方法绑定
    app.get("/api/index", indexController.index);
    app.get("/api/info", indexController.info);
    app.get("/api/test", indexController.test);
    app.get("/api/test", indexController.test);
    app.post("/api/add-user", indexController.addUser);

    // http://localhost:1337/user/1111
    app.get('/user/:id', function(req, res) {
        console.log("id:", req.params.id)
        let id = req.params.id //req.params.xx替代req.param("xx")
        let name = req.query.name || "" //获取url上面的name=daheige
        console.log("name: ", name)
        res.end('id: ' + id);
    });

}

module.exports = RunApiRouter