var convert = require("../lib/conversion.js");

var converter = convert.createConverter({
    units: [
        {names: ["centimetres"], abbreviations: ["cm"], size: 0.01, dimension: "length"},
        {names: ["metres"], abbreviations: ["m"], size: 1, dimension: "length"},
        {names: ["seconds"], size: 1, dimension: "time"}
    ]
});

exports.noOutputIfFromIsEmpty = function(test) {
    test.equal(converter("", "inches"), null);
    test.done();
};

exports.noOutputIfToIsEmpty = function(test) {
    test.equal(converter("4 metres", ""), null);
    test.done();
};

exports.noOutputIfFromIsWhitespace = function(test) {
    test.equal(converter("  ", "inches"), null);
    test.done();
};

exports.noOutputIfToIsWhitespace = function(test) {
    test.equal(converter("4 metres", "  "), null);
    test.done();
};

exports.convertsBetweenUnitsIfTheUnitsRepresentTheSameMetric = function(test) {
    test.equal(converter("4 metres", "centimetres"), "4 metres is 400 centimetres");
    test.done();
};

exports.inputStringsAreCleanedUp = function(test) {
    test.equal(converter("  4    metres", " centimetres "), "4 metres is 400 centimetres");
    test.done();
};

exports.inputStringsAreCleanedUp = function(test) {
    test.equal(converter("  4    metres", " centimetres "), "4 metres is 400 centimetres");
    test.done();
};

exports.errorMessageIfFromStringIsInWrongFormat = function(test) {
    test.equal(converter("a", "centimetres"), "a doesn't look like a quantity to me");
    test.done();
};

exports.errorMessageIfFromSizeIsUnreadable = function(test) {
    test.equal(converter("sdf metres", "centimetres"), "sdf doesn't look like a number to me");
    test.done();
};

exports.errorMessageIfFromUnitsIsNotRecognised = function(test) {
    test.equal(converter("8 inches", "centimetres"), "I don't recognise \"inches\"");
    test.done();
};

exports.errorMessageIfToUnitsIsNotRecognised = function(test) {
    test.equal(converter("8 metres", "inches"), "I don't recognise \"inches\"");
    test.done();
};

exports.errorMessageIfDimensionsDontMatch = function(test) {
    test.equal(converter("8 metres", "seconds"), "seconds is not a measure of length");
    test.done();
};

exports.abbreviationsAreRecognisedInFromAndToStrings = function(test) {
    test.equal(converter("4 m", "cm"), "4 metres is 400 centimetres");
    test.done();
};

exports.unitsWithPrefixesAreGenerated = function(test) {
    var converter = convert.createConverter({
        units: [
            {names: ["metres"], size: 1, dimension: "length"}
        ],
        prefixes: [
            {name: "centi", factor: 1e-2}
        ]
    });
    test.equal(converter("8 metres", "centimetres"), "8 metres is 800 centimetres");
    test.done();
};

exports.unitAbbreviationsWithPrefixesAreGenerated = function(test) {
    var converter = convert.createConverter({
        units: [
            {names: ["metres"], abbreviations: ["m"], size: 1, dimension: "length"}
        ],
        prefixes: [
            {name: "centi", abbreviation: "c", factor: 1e-2}
        ]
    });
    test.equal(converter("8 m", "cm"), "8 metres is 800 centimetres");
    test.done();
};
