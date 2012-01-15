var _ = require("underscore");

var tidy = function(str) {
    return str.replace(/^\s\s*/, "").replace(/\s\s*$/, "").replace(/\s\s+/, " ");
};

exports.createConverter = function(config) {
    var units = (config || {}).units;
    
    var findUnits = function(name) {
        return _.find(units, function(unit) {
            return _.indexOf(unit.names, name) !== -1;
        });
    };
    
    var doConversion = function(fromString, toString) {
        fromString = tidy(fromString);
        toString = tidy(toString);
        
        var parsedFrom = /^(\S)+\s+(.+)$/.exec(fromString);
        var fromSize = parseFloat(parsedFrom[1]);
        var fromUnitsName = parsedFrom[2];
        
        var fromUnits = findUnits(fromUnitsName);
        
        var toUnits = findUnits(toString);
        
        var toSize = fromSize * fromUnits.size / toUnits.size;
        return fromString + " is " + toSize + " " + toUnits.names[0];
    };
    
    return function(from, to) {
        if (from && to) {
            return doConversion(from, to);
        } else {
            return null;
        }
    };
};
