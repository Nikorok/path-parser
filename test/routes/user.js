const app = require('../app');

app.initRoute('/user/{id:number}', function (req, res) {
    res.end('Hello that user page, id: ' + req.params.id);
});
