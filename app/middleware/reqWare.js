module.exports = {
    //中间件写法
    setHeader: async function(req, res, next) {
        let isAjax = req.xhr || req.is('json');
        if (isAjax) {
            res.set('Content-Type', 'application/json');
        }

        console.log('Time:', Date.now())
        next();
    }
};