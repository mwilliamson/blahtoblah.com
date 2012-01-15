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
    
    var parseFrom = function(fromString) {
        var parsedFrom = /^(\S)+\s+(.+)$/.exec(fromString);
        if (parsedFrom === null) {
            return null;
        }
        var fromSize = parseFloat(parsedFrom[1]);
        var fromUnitsName = parsedFrom[2];
        var units = findUnits(fromUnitsName);
        return {
            size: fromSize,
            units: units
        };
    };
    
    var doConversion = function(fromString, toString) {
        var from = parseFrom(fromString);
        if (from === null) {
            return fromString + " doesn't look like a quantity to me";
        };
        
        var toUnits = findUnits(toString);
        
        var toSize = from.size * from.units.size / toUnits.size;
        return fromString + " is " + toSize + " " + toUnits.names[0];
    };
    
    return function(from, to) {
        from = tidy(from);
        to = tidy(to);
        if (from && to) {
            return doConversion(from, to);
        } else {
            return null;
        }
    };
};
