var connect = require("connect");

var oneDay = 1000 * 60 * 60 * 24;
var oneYear = oneDay * 365;
var staticMiddleware = connect.static("static", {maxAge: oneYear});

connect.createServer(
    staticMiddleware
).listen(8414);
