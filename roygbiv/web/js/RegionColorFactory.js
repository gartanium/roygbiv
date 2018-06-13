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

    var brainRegionCount = 31;

    var _min;
    var _mid;
    var _max;

    var _colorMin;
    var _colorMid;
    var _colorMax;

    // Possible normalizations for our region color data.
    var normalizationsEnum = {
        noState:   0,
        minMidMax: 1,
        zScore:    2
    }

    var normalizationState = normalizationsEnum.noState;
    var colorScale;
    var colorArray;
    var unprocessedData;

    var regionGeneExpressionData = [];

    /**
     * Sets the gene expression data that needs to be processed.
     * @param {Array} data Data to be processed into a dictionary of colors.
     */
    this.setDataToProcess = function(data) {
        
        try {
            validateGeneExpressionData(data);
            regionGeneExpressionData = data;
        }
        catch (error) {
            throw error;
        }
    }
    
    /**
     * Set the factory to build gene expression data using zScore
     */
    this.setNormalizationStateToZScore = function() {
        normalizationState = normalizationsEnum.zScore;
    }


    this.setNormalizationStateToMinMidMax = function(min, mid, max) {
        try {
            validateMinMidMax(min, mid, max);
            normalizationState = normalizationsEnum.minMidMax;
        } catch (error) {
            throw error;
        }
        
    }

    this.setColors = function(minColor, midColor, maxColor) {
        _colorMin = minColor;
        _colorMid = midColor;
        _colorMax = maxColor;
    }

    this.generateRegionColorArray = function() {
        if(normalizationState === normalizationsEnum.noState) {
            throw "ERROR: The factory does not have a normalization state!";
        }
        else if(regionGeneExpressionData.length === 0) {
            throw "ERROR: Gene expression data for a region must be loaded into the factory class!";
        }
        else if(typeof _colorMin == "undefined" || _colorMid == "undefined" || _colorMax == "undefined") {
            throw "ERROR: The factory does not have a set color scale!";
        }
        else {
            colorScale = buildColorScale(_min, _mid, _max, _colorMin, _colorMid, _colorMax);
            return buildColorArray(colorScale, regionGeneExpressionData);
        }
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
    function buildColorScale(min, mid, max, minColor, midColor, maxColor) {
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
    function buildColorArray(colorScale, data) {
        //take color scale and return values mapped to object
        //range will be replaced with list of values, key should be
        //taken from column headers
        //ISSUE Each val of j represented in values
        //Each val of j + 1002 not represented in data
        //Color scale works, but unfortunately since expressions are all so similar, colors are almost identical
        var dict = [];
        for (var j = 0; j < 34; j++) {
            if (data[j]) {
                
                red = d3.color(colorScale(parseFloat(data[j]))).r / 256;
                green =  d3.color(colorScale(parseFloat(data[j]))).g / 256;
                blue = d3.color(colorScale(parseFloat(data[j]))).b / 256;
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
     * Validates that the gene expression data array has data for each region of
     * the brain, and only numerical data.
     */
    function validateGeneExpressionData(data) {
        // There are only 31 regions expressed.
        if(data.length != brainRegionCount) {
            throw "ERROR: You must provide data for " + brainRegionCount + " brain regions!";
        }
        
        // Each value in the array is a number.
        for(i = 0; i < data.length; i++) {
            if(typeof data[i] === "number")
                continue;
            else
                throw "ERROR: The data represinting gene expression for each region must be numerical!";
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