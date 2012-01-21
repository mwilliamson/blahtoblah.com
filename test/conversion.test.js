var convert = require("../lib/conversion.js");

var converter = convert.createConverter({
    units: [
        {names: ["centimetres"], abbreviations: ["cm"], size: 0.01, dimension: "length"},
        {names: ["metres"], abbreviations: ["m"], size: 1, dimension: "length"},
        {names: ["inches"], abbreviations: ["in"], size: 0.0254, dimension: "length"},
        {names: ["seconds"], size: 1, dimension: "time"},
        {names: ["minutes"], size: 60, dimension: "time"}
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
    test.equal(converter("8 linguine", "centimetres"), "I don't recognise \"linguine\"");
    test.done();
};

exports.errorMessageIfToUnitsIsNotRecognised = function(test) {
    test.equal(converter("8 metres", "linguine"), "I don't recognise \"linguine\"");
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

exports.unitsAreRoundedToSixSignificantFigures = function(test) {
    test.equal(converter("1 m", "in"), "1.0 metres is 39.3701 inches");
    test.done();
};

exports.blahAsToStringSelectsRandomUnitInSameDimension = function(test) {
    test.equal(converter("120 seconds", "blah"), "120 seconds is 2 minutes");
    test.done();
};

exports.blahForBothFromUnitsAndToUnitsSelectsRandomUnit = function(test) {
    var converter = convert.createConverter({
        units: [
            {names: ["centimetres"], abbreviations: ["cm"], size: 0.01, dimension: "length"},
            {names: ["metres"], abbreviations: ["m"], size: 1, dimension: "length"}
        ]
    });
    var result = converter("2 blah", "blah");;
    test.ok(result === "2 centimetres is 0.02 metres" || result === "2 metres is 200 centimetres");
    test.done();
};

exports.blahAsFromUnitStringSelectsRandomUnitInSameDimensionAsToString = function(test) {
    test.equal(converter("120 blah", "minutes"), "120 seconds is 2 minutes");
    test.done();
};

exports.blahAsFromSizeSelectsSizeUsingSelector = function(test) {
    var converter = convert.createConverter({
        units: [
            {names: ["seconds"], size: 1, dimension: "time"},
            {names: ["minutes"], size: 60, dimension: "time"}
        ],
        blahSelector: {
            generateSize: function() {
                return 120;
            }
        }
    });
    test.equal(converter("blah seconds", "minutes"), "120 seconds is 2 minutes");
    test.done();
};

exports.canSelectRandomSizeUsingDefaultBlahSelector = function(test) {
    var result = converter("blah minutes", "seconds");
    test.ok(/^-?[0-9]+ minutes is -?[0-9]+ seconds$/.test(result), "got: " + result);
    test.done();
};

exports.zeroesAreNotRemovedFromExponentialNotation = function(test) {
    test.equal(converter("1e30 m", "m"), "1.00000e+30 metres is 1.00000e+30 metres");
    test.done();
};

exports.hyphenatePrefixesIfTheyContainASpace = function(test) {
    var converter = convert.createConverter({
        units: [
            {names: ["metres"], abbreviations: ["m"], size: 1, dimension: "length"},
            {names: ["long buses"], abbreviations: [], size: 20, dimension: "length"},
        ],
        prefixes: [
            {name: "centi", abbreviation: "c", factor: 1e-2}
        ]
    });
    test.equal(converter("20 m", "centi-long buses"), "20 metres is 100 centi-long buses");
    test.done();
};

exports.oneUnitIsDisplayedWithPointZero = function(test) {
    // Hack to try to disguise the lack of singular/plural distinction
    test.equal(converter("1 m", "m"), "1.0 metres is 1.0 metres");
    test.done();
};

exports.outputFormatIsUsedForOutputIfPresent = function(test) {
    var converter = convert.createConverter({
        units: [
            {
                names: ["Olympic-sized swimming pools"], abbreviations: [], size: 2502.8676904, dimension: "volume",
                outputFormat: "enough to fill {size} {unit}"
            },
            {names: ["cats"], abbreviations: [], size: 0.0106188175, dimension: "volume"}
        ]
    });
    test.equal(
        converter("500000 cats", "Olympic-sized swimming pools"),
        "500000 cats is enough to fill 2.12133 Olympic-sized swimming pools"
    );
    test.done();
};
