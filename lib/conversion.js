var _ = require("underscore");
var sprintf = require("sprintf").sprintf;

var isRandomString = function(str) {
    return str === "blah";
};

var tidy = function(str) {
    return str.replace(/^\s\s*/, "").replace(/\s\s*$/, "").replace(/\s\s+/, " ");
};

var log10 = function(value) {
    return Math.log(value) / Math.log(10);
};

var formatNumber = function(number) {
    var value = number.toPrecision(6);
    if (value.indexOf("e") !== -1) {
        return value;
    }
    var chopIndex = value.length;
    while (value.lastIndexOf("\.", chopIndex - 1) !== -1 && [".", "0"].indexOf(value.charAt(chopIndex - 1)) !== -1) {
        chopIndex -= 1;
    }
    value = value.substring(0, chopIndex);
    if (value === "1") {
        return "1.0";
    } else {
        return value;
    }
};

var addPrefixToStrings = function(prefix, strings) {
    return strings.map(function(str) {
        if (str.indexOf(" ") === -1) {
            return prefix + str;
        } else {
            return prefix + "-" + str;
        }
    });
};
    
var randomInt = function(min, max) {  
    return Math.floor(Math.random() * (max - min)) + min;
};

var createRandomBlahSelector = function() {
    return {
        generateSize: function() {
            return randomInt(-1000, 1001);
        }
    };
};

exports.createConverter = function(config) {
    var blahSelector = config.blahSelector || createRandomBlahSelector();
    var units = _.flatten(_.map(config.units, function(unit) {
        var mainUnit = {
            names: _.flatten([unit.names, unit.abbreviations]),
            size: unit.size,
            dimension: unit.dimension,
            outputFormat: unit.outputFormat
        };
        mainUnit.main = mainUnit;
        var subUnits = (config.prefixes || []).map(function(prefix) {
            return {
                names: _.flatten([
                    addPrefixToStrings(prefix.name, unit.names),
                    addPrefixToStrings(prefix.abbreviation, unit.abbreviations || [])
                ]),
                size: unit.size * prefix.factor,
                dimension: unit.dimension,
                main: mainUnit,
                outputFormat: unit.outputFormat
            };
        });
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
    
    var parseFromSize = function(sizeString) {
        if (isRandomString(sizeString)) {
            return blahSelector.generateSize();
        } else {
            var fromSize = parseFloat(sizeString);
            if (isNaN(fromSize)) {
                return {error: sizeString + " doesn't look like a number to me"};
            } else {
                return fromSize;
            }
        }
    };
    
    var parseFromUnits = function(fromUnitsName, toString) {
        if (isRandomString(fromUnitsName)) {
            if (isRandomString(toString)) {
                return selectRandomUnit();
            } else {
                var toUnits = findUnits(toString);
                return selectRandomUnit({dimension: toUnits.dimension, not: toUnits});
            }
        } else {
            var units = findUnits(fromUnitsName);
            if (!units) {
                return unrecognisedUnitsError(fromUnitsName);
            }
            return units;
        }
    };
    
    var parseFrom = function(fromString, toString) {
        var parsedFrom = /^(\S+)\s+(.+)$/.exec(fromString);
        if (parsedFrom === null) {
            return {error: fromString + " doesn't look like a quantity to me"};
        }
        var sizeString = parsedFrom[1];
        var fromSize = parseFromSize(sizeString);
        if (fromSize.error) {
            return fromSize;
        }
        var fromUnitsName = parsedFrom[2];
        var units = parseFromUnits(fromUnitsName, toString);
        if (units.error) {
            return units;
        }
        return {
            size: fromSize,
            units: units
        };
    };
    
    var selectRandomUnit = function(options) {
        var possibleUnits;
        if (options) {
            possibleUnits = units.filter(function(unit) {
                return unit.dimension === options.dimension && unit.main !== options.not.main;
            });
        } else {
            possibleUnits = units;
        }
        return possibleUnits[randomInt(0, possibleUnits.length)];
    };
    
    var findToUnits = function(name, from) {
        if (isRandomString(name)) {
            return selectRandomUnit({dimension: from.units.dimension, not: from.units});
        }
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
        var from = parseFrom(fromString, toString);
        if (from.error) {
            return from.error;
        };
        
        var toUnits = findToUnits(toString, from);
        if (toUnits.error) {
            return toUnits.error;
        }
        
        var toSize = from.size * from.units.size / toUnits.size;
        var formattedToSize = formatNumber(toSize);
        var toOutput;
        if (toUnits.outputFormat) {
            toOutput = toUnits.outputFormat.replace("{size}", formattedToSize).replace("{unit}", toUnits.names[0]);
        } else {
            toOutput = formattedToSize + " " + toUnits.names[0];
        }
        return formatNumber(from.size) + " " + from.units.names[0] + " is " + toOutput;
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
