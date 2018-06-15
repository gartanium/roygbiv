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

function RegionColorFactory(geneRegionExpressionData, geneLocations) {
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

    var _specificRegionGeneData = [];              // Data for a specific gene for all the regions.
    var _normalizedData = [];

    var _geneRegionExpressionData = geneRegionExpressionData;      // Data representing how each gene is expressed in each region.
    var _normalizedRegionData = [];          // Normalized version of the region expression data.
    var _geneLocations = geneLocations;                 // Locations for each gene in the data.
    var _gene;                       // Location of the gene we are analyzing.
    
    // SETTERS **************************************************

    /**
     * Set the factory to build gene expression data using zScore
     */
    this.setNormalizationStateToZScore = function() {
        normalizationState = normalizationsEnum.zScore;
    }

    /**
     * Sets the factory to build gene expression data using min, mid, and max.
     */
    this.setNormalizationStateToMinMidMax = function(min, mid, max) {
        try {
            validateMinMidMax(min, mid, max);
            normalizationState = normalizationsEnum.minMidMax;
            _min = min; 
            _mid = mid;
            _max = max;
        } catch (error) {
            throw error;
        }
        
    }

    /**
     * Sets the colors for min, mid, and max scale.
     */
    this.setColors = function(minColor, midColor, maxColor) {
        validateColor(minColor);
        validateColor(midColor);
        validateColor(maxColor);
        _colorMin = minColor;
        _colorMid = midColor;
        _colorMax = maxColor;
    }

    /**
     * Sets the Gene to be analyzed.
     * @param {String} gene Name of the gene to be analyzed.
     */
    this.setGene = function (gene) {
        try {
            if(gene == "") {
                throw "ERROR: No gene was specified (Empty string)";
            }
            else if(!(_gene in _geneLocations)) {
                throw "ERROR: " + gene + " is not a valid gene!";
            }
            else {
                _gene = gene;
                _specificRegionGeneData = _geneLocations[_gene]; 
            }
        }
        catch (errorMsg) {
            throw errorMsg;
        }
    }

    /**
     * Sets the data that expresses how each gene is represented in each brain region.
     * @param {array} regionExpressionArray a 2-dimensional array expressing how each gene is 
     * represented in each brain region.
     */
    this.setRegionExpressionData = function(regionExpressionArray) {
        _geneRegionExpressionData = regionExpressionArray;
    }

    /**
     * Sets the key that lets the factory know where each gene is located in the Region Expression Array.
     * @param {Array} geneExpressionKey An associative array representing where each gene is located at.
     */
    this.setGeneKey = function(geneExpressionKey) {
        _geneLocations = geneExpressionKey;
    }

    // GETTERS **************************************************************

    
    this.getColorScale = function() {

    }

    /**
     * Returns a dictionary of colors for representing how a gene is expressed 
     */
    this.generateRegionColorArray = function() {
       
        // TODO: Data validation logic
        if(normalizationState === normalizationsEnum.noState) {
            throw "ERROR: The factory does not have a normalization state!";
        }
        else if(_specificRegionGeneData.length === 0) {
            throw "ERROR: Invalid data for gene: " + _gene + "!";
        }
        else if(_geneLocations.length === 0) {
            throw "ERROR: Invalid gene location associative array! (Did you forget to set one?)";
        }
        else if(_geneRegionExpressionData.length === 0) {
            throw "ERROR: Invalid gene region expression data! (Did you forget to set the data?)";
        }
        else if(typeof _colorMin == "undefined" || _colorMid == "undefined" || _colorMax == "undefined") {
            throw "ERROR: The factory does not have a set color scale!";
        }
        
        validateGeneExpressionData(_specificRegionGeneData);

        // TODO: Any logic for processing the data goes here.
        _normalizedData = getNormalizeData(_specificRegionGeneData);

        if(normalizationState === normalizationsEnum.zScore){
            _min = Math.min.apply(Math, _specificRegionGeneData);
            _mid = 0;
            _max = Math.max.apply(Math, _specificRegionGeneData);
        }

        colorScale = buildColorScale(_min, _mid, _max, _colorMin, _colorMid, _colorMax);
        return buildColorArray(colorScale, _normalizedData);
    
    }

    function validateColor(colorString) {

        try {
            color = d3.color(colorString);
            if(color.displayable)
                return true;
            else throw 'ERROR: Invalid color';
        }
        catch (e) {
            return false;
        }
    }

    /** 
     * Creates a d3 scale that will be able to generate colors for our brain.
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
        var colorArray = [];
        for (var j = 0; j < data.length; j++) {

            tempColor = d3.color(colorScale(parseFloat(data[j])));
            // We want a 0 to 1 scale for the colors.
            red = tempColor.r / 256;
            green =  tempColor.g / 256;
            blue = tempColor.b / 256;
            colorArray[j] = [red, green, blue];
        }
        return colorArray;

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

    /**
     * Normalizes the data based on the normalization state.
     */
    function getNormalizeData(data) {

        normalizedData = shallowCopyArray(data);

        if(normalizationState == normalizationsEnum.zScore) {
            applyZScore(normalizedData);
        }

        return normalizedData;
    }

    function shallowCopyArray(oldArray) {
        return oldArray.slice()
    }
}