var connect = require("connect");
var dust = require("dust");
var url = require("url");
var fs = require("fs");
var conversion = require("./conversion");

var oneDay = 1000 * 60 * 60 * 24;
var oneYear = oneDay * 365;
var staticMiddleware = connect.static("static", {maxAge: oneYear});

var convert = conversion.createConverter({
    units: [
        {names: ["centimetres", "cm"], size: 0.01, siUnit: "m"},
        {names: ["metres", "m"], size: 1, siUnit: "m"},
    ]
});

var renderIndexPage = function(query, response) {
    fs.readFile("index.html", "utf-8", function(err, templateSource) {
        var from = query.from || "";
        var to = query.to || "";
        var result = convert(from, to);
        dust.renderSource(templateSource, {from: from, to: to, result: result}, function(err, html) {
            response.writeHead(200, {"Content-Type": "text/html"});
            response.end(html);
        });
    });
};

var indexPageMiddleware = function(request, response, next) {
    var requestUrl = url.parse(request.url, true);
    if (requestUrl.pathname === "/") {
        renderIndexPage(requestUrl.query, response);
    } else {
        next();
    }
};

connect.createServer(
    staticMiddleware,
    indexPageMiddleware
).listen(8414);
