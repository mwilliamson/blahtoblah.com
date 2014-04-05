var url = require("url");
var fs = require("fs");

var connect = require("connect");
var dust = require("dustjs-linkedin");

var conversion = require("./conversion");
var units = require("./units");

var oneDay = 1000 * 60 * 60 * 24;
var oneYear = oneDay * 365;
var staticMiddleware = connect.static(__dirname + "/../static", {maxAge: oneYear});

var convert = conversion.createConverter({
    units: units,
    prefixes: [
        {name: "yocto", abbreviation: "y", factor: 1e-24},
        {name: "zepto", abbreviation: "z", factor: 1e-21},
        {name: "atto", abbreviation: "a", factor: 1e-18},
        {name: "femto", abbreviation: "f", factor: 1e-15},
        {name: "pico", abbreviation: "p", factor: 1e-12},
        {name: "nano", abbreviation: "n", factor: 1e-9},
        {name: "micro", abbreviation: "μ", factor: 1e-6},
        {name: "milli", abbreviation: "m", factor: 1e-3},
        {name: "centi", abbreviation: "c", factor: 1e-2},
        {name: "deci", abbreviation: "d", factor: 1e-1},
        {name: "deca", abbreviation: "da", factor: 1e1},
        {name: "hecto", abbreviation: "h", factor: 1e2},
        {name: "kilo", abbreviation: "k", factor: 1e3},
        {name: "mega", abbreviation: "M", factor: 1e6},
        {name: "giga", abbreviation: "G", factor: 1e9},
        {name: "tera", abbreviation: "T", factor: 1e12},
        {name: "peta", abbreviation: "P", factor: 1e15},
        {name: "exa", abbreviation: "E", factor: 1e18},
        {name: "zetta", abbreviation: "Z", factor: 1e21},
        {name: "yotta", abbreviation: "Y", factor: 1e24}
    ]
});

var renderIndexPage = function(query, response) {
    fs.readFile(__dirname + "/../index.html", "utf-8", function(err, templateSource) {
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
