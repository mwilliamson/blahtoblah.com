var connect = require("connect");
var dust = require("dust");
var url = require("url");
var fs = require("fs");

var oneDay = 1000 * 60 * 60 * 24;
var oneYear = oneDay * 365;
var staticMiddleware = connect.static("static", {maxAge: oneYear});

var renderIndexPage = function(request, response) {
    fs.readFile("index.html", "utf-8", function(err, templateSource) {
        dust.renderSource(templateSource, {}, function(err, html) {
            response.writeHead(200, {"Content-Type": "text/html"});
            response.end(html);
        });
    });
};

var indexPageMiddleware = function(request, response, next) {
    var requestUrl = url.parse(request.url);
    if (requestUrl.pathname === "/") {
        renderIndexPage(request, response);
    } else {
        next();
    }
};

connect.createServer(
    staticMiddleware,
    indexPageMiddleware
).listen(8414);
