var _ = require("underscore");
var sprintf = require("sprintf").sprintf;

var tidy = function(str) {
    return str.replace(/^\s\s*/, "").replace(/\s\s*$/, "").replace(/\s\s+/, " ");
};

var log10 = function(value) {
    return Math.log(value) / Math.log(10);
};

var formatNumber = function(number) {
    var value = number.toPrecision(6);
    var chopIndex = value.length;
    while (value.lastIndexOf("\.", chopIndex - 1) !== -1 && [".", "0"].indexOf(value.charAt(chopIndex - 1)) !== -1) {
        chopIndex -= 1;
    }
    return value.substring(0, chopIndex);
};

var addPrefixToStrings = function(prefix, strings) {
    return strings.map(function(str) {
        return prefix + str;
    });
};

exports.createConverter = function(config) {
    var units = _.flatten(_.map(config.units, function(unit) {
        var subUnits = (config.prefixes || []).map(function(prefix) {
            return {
                names: _.flatten([
                    addPrefixToStrings(prefix.name, unit.names),
                    addPrefixToStrings(prefix.abbreviation, unit.abbreviations || [])
                ]),
                size: unit.size * prefix.factor,
                dimension: unit.dimension
            };
        });
        var mainUnit = {
            names: _.flatten([unit.names, unit.abbreviations]),
            size: unit.size,
            dimension: unit.dimension
        };
        return [subUnits, mainUnit];
    }));
    
    var findUnits = function(name) {
        return _.find(units, function(unit) {
            return _.indexOf(unit.names, name) !== -1;
        });
    };
    
    var unrecognisedUnitsError = function(name) {
        return {error: "I don't recognise \"" + name + "\""};
    };
    
    var parseFrom = function(fromString) {
        var parsedFrom = /^(\S+)\s+(.+)$/.exec(fromString);
        if (parsedFrom === null) {
            return {error: fromString + " doesn't look like a quantity to me"};
        }
        var fromSize = parseFloat(parsedFrom[1]);
        if (isNaN(fromSize)) {
            return {error: parsedFrom[1] + " doesn't look like a number to me"};
        }
        var fromUnitsName = parsedFrom[2];
        var units = findUnits(fromUnitsName);
        if (!units) {
            return unrecognisedUnitsError(fromUnitsName);
        }
        return {
            size: fromSize,
            units: units
        };
    };
    
    var findToUnits = function(name, from) {
        var toUnits = findUnits(name);
        if (!toUnits) {
            return unrecognisedUnitsError(name);
        }
        if (toUnits.dimension !== from.units.dimension) {
            return {error: name + " is not a measure of " + from.units.dimension};
        };
        return toUnits;
    };
    
    var doConversion = function(fromString, toString) {
        var from = parseFrom(fromString);
        if (from.error) {
            return from.error;
        };
        
        var toUnits = findToUnits(toString, from);
        if (toUnits.error) {
            return toUnits.error;
        }
        
        var toSize = from.size * from.units.size / toUnits.size;
        return formatNumber(from.size) + " " + from.units.names[0] + " is " + formatNumber(toSize) + " " + toUnits.names[0];
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
