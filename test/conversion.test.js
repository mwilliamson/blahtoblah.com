var convert = require("../lib/conversion.js");

exports.noOutputIfFromIsEmpty = function(test) {
    var converter = convert.createConverter();
    test.equal(converter("", "inches"), null);
    test.done();
};

exports.noOutputIfToIsEmpty = function(test) {
    var converter = convert.createConverter();
    test.equal(converter("4 metres", ""), null);
    test.done();
};

exports.noOutputIfFromIsWhitespace = function(test) {
    var converter = convert.createConverter();
    test.equal(converter("  ", "inches"), null);
    test.done();
};

exports.noOutputIfToIsWhitespace = function(test) {
    var converter = convert.createConverter();
    test.equal(converter("4 metres", "  "), null);
    test.done();
};

exports.convertsBetweenUnitsIfTheUnitsRepresentTheSameMetric = function(test) {
    var converter = convert.createConverter({
        units: [
            {names: ["centimetres"], size: 0.01, siUnit: "m"},
            {names: ["metres"], size: 1, siUnit: "m"},
        ]
    });
    test.equal(converter("4 metres", "centimetres"), "4 metres is 400 centimetres");
    test.done();
};

exports.inputStringsAreCleanedUp = function(test) {
    var converter = convert.createConverter({
        units: [
            {names: ["centimetres"], size: 0.01, siUnit: "m"},
            {names: ["metres"], size: 1, siUnit: "m"},
        ]
    });
    test.equal(converter("  4    metres", " centimetres "), "4 metres is 400 centimetres");
    test.done();
};

exports.inputStringsAreCleanedUp = function(test) {
    var converter = convert.createConverter({
        units: [
            {names: ["centimetres"], size: 0.01, siUnit: "m"},
            {names: ["metres"], size: 1, siUnit: "m"},
        ]
    });
    test.equal(converter("  4    metres", " centimetres "), "4 metres is 400 centimetres");
    test.done();
};

exports.errorMessageIfFromStringIsInWrongFormat = function(test) {
    var converter = convert.createConverter({
        units: [
            {names: ["centimetres"], size: 0.01, siUnit: "m"},
            {names: ["metres"], size: 1, siUnit: "m"},
        ]
    });
    test.equal(converter("a", "centimetres"), "a doesn't look like a quantity to me");
    test.done();
};

exports.errorMessageIfFromSizeIsUnreadable = function(test) {
    var converter = convert.createConverter({
        units: [
            {names: ["centimetres"], size: 0.01, siUnit: "m"},
            {names: ["metres"], size: 1, siUnit: "m"},
        ]
    });
    test.equal(converter("sdf metres", "centimetres"), "sdf doesn't look like a number to me");
    test.done();
};

exports.errorMessageIfFromUnitsIsNotRecognised = function(test) {
    var converter = convert.createConverter({
        units: [
            {names: ["centimetres"], size: 0.01, siUnit: "m"},
            {names: ["metres"], size: 1, siUnit: "m"},
        ]
    });
    test.equal(converter("8 inches", "centimetres"), "I don't recognise \"inches\"");
    test.done();
};

exports.errorMessageIfToUnitsIsNotRecognised = function(test) {
    var converter = convert.createConverter({
        units: [
            {names: ["centimetres"], size: 0.01, siUnit: "m"},
            {names: ["metres"], size: 1, siUnit: "m"},
        ]
    });
    test.equal(converter("8 metres", "inches"), "I don't recognise \"inches\"");
    test.done();
};
