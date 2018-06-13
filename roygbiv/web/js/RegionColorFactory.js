/*
 * Summary.
 * Functionality for building an associative array of colors that describe how genes are
 * expressed on different regions of the brain.
 * 
 * Description.
 * Contains functionalities for customizing how the associative array of colors 
 * is built. Such options include z-score normilization, scaling with min-mid-max
 * options, and relative for the given gene expression data.
 * 
 * @file this file defines a RegionColorFactory object.
 * @author Matthew Brown
 * @since 06.08.18
 */

function RegionColorFactory() {

    var colorMin;
    var colorMid;
    var colorMax;

    // Possible normalizations for our region color data.
    var normalizationsEnum = {
        zScore: 0,
        minMidMax: 1
    }

    var normalizationState;
    var colorScale;
    var colorDict;
    var unprocessedData;

    /**
     * Sets the gene expression data that needs to be processed.
     * @param {Array} data Data to be processed into a dictionary of colors.
     */
    this.setDataToProcess = function(data) {
        unprocessedData = data;
    }
    
    /**
     * 
     */
    this.setZScore = function() {
        normalizationState = normalizationsEnum.zScore;
    }

    this.setMinMidMax = function() {
        normalizationState = normalizationsEnum.minMidMax;
    }

    this.setColors = function(minColor, midColor, maxColor) {

    }

    this.getRegionColorDictionary = function() {

    }

    this.getColorScale = function() {

    }

    function validateColor(colorString) {

        try {
            color = d3.color(colorString);
            if(color.displayable)
                return true;
            else throw 'invalid color';
        }
        catch (e) {
            return false;
        }
    }

    /** 
     * @returns d3.scale 
    */
    function buildColorScale(minColor, midColor, maxColor) {
        //return scale of colors for min to mid to max values
        var colors = d3.scale.linear()
        .domain([min, mid, max])
        .range([minColor, midColor, maxColor]);
        return colors;
    }

    /** 
     * Builds an associative array containing color data for describing
     * the differing regions of the brain, and the gene expression data.
    */
    function buildColorDictionary() {
        //take color scale and return values mapped to object
        //range will be replaced with list of values, key should be
        //taken from column headers
        //ISSUE Each val of j represented in values
        //Each val of j + 1002 not represented in data
        //Color scale works, but unfortunately since expressions are all so similar, colors are almost identical
        var dict = [];
        for (var j = 0; j < 34; j++) {
            if (data[j]) {
                
                red = d3.color(colorsScale(parseFloat(data[j]))).r / 256;
                green =  d3.color(colorsScale(parseFloat(data[j]))).g / 256;
                blue = d3.color(colorsScale(parseFloat(data[j]))).b / 256;
                dict[j + 1002] = [red, green, blue];
            }
        }
        return dict;

    }

    /**
     * Validates the given min, mid, and max values.
     * Throws an error if one occurs.
     * @param {float} min 
     * @param {float} mid 
     * @param {float} max 
     */
    function validateMinMidMax(min, mid, max) {
        if (min < mid && mid < max) {
            return;
        }
        else {
            throw "ERROR: min must be less than mid, and mid must be less than max!"
        }
    }

    /**
     * @function mean returns the mean value for the data.
     * @param {float array} data 
     */
    function mean(data) {
        var total = 0;
        length = data.length;
        for (var i = 0; i < length; i += 1) {
            total += data[i];
        }
        return total / data.length;
    }
}