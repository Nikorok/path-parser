const pathParser = require('../');
const http = require('http');

var routes = [];

const server = http.createServer((req, res) =>{
    for(const route of routes) {
        if(pathParser.compare(route.pattern, req.url)){

            req.params = pathParser.getParams(route.pattern, req.url);
            route.handler(req, res);
        }
    }
});

server.listen(8000);

function initRoute(template, handler){
    const pattern = pathParser.compile(template);

    routes.push({pattern, handler});
}

module.exports = {initRoute};

require('./routes/main');
require('./routes/user');
