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

function RegionColorFactory(data, locationArray, minColor, midColor, maxColor) {

    var _colorMin = minColor;
    var _colorMid = midColor;
    var _colorMax = maxColor;

    var _colorScale;

    var _geneData = data;
    var _locationArray = locationArray;      

    var _normalizedData = [];       
    var _normalizationState = 0;
    var _normalizationEnum = {
        default: 0,
        zScoreRow: 1,
        zScoreColumn: 2
    }

    /**
     * Set the colors that the factory uses to produce the associative color array.
     */
    this.setColors = function(minColor, midColor, maxColor) {
        _colorMin = minColor;
        _colorMid = midColor;
        _colorMax = maxColor;
    }

    /**
     * Returns a dictionary of colors for representing how a gene is expressed 
     */
    this.generateRegionColorArray = function(gene) {
        
        // Get the gene data
        data = getGeneData(gene);

        // Data validation
        validateGeneExpressionData(data);
        validateColor(minColor);
        validateColor(midColor);
        validateColor(maxColor);

        // Perform data normalizations
        _normalizedData = generateNormalizedData(data);

        // Get the min mid and max
        _min = Math.min.apply(Math, data);
        _mid = arr.mean(data);
        _max = Math.max.apply(Math, data);
        
        // Generate the color scale

        // Build the Color Array.
        
      
        colorScale = buildColorScale(_min, _mid, _max, _colorMin, _colorMid, _colorMax);
        return buildColorArray(colorScale, _normalizedData);
    }

    /**
     * Returns the color scale associated with the factory.
     */
    this.getColorScale = function() {
        return _colorScale;
    }


    /**
     * Sets the state for normalizing the data.
     * @param {String} state 
     * "default": No normalization occurs
     * "zScoreRow": Each row is normalized relative to each row.
     * "zScoreColumn": Each column is normalized relative to each column.
     */
    this.setNormalizationState = function(state) {
        
        _normalizationState = _normalizationEnum[state];

        if(typeof _normalizationState == "undefined") {
            throw "ERROR: " + state + " is not a valid option!";
        }
    }

    function generateNormalizedData(data) {
        normalizedData = shallowCopyArray(data);

        if(_normalizationState == _normalizationEnum.default) {
            return normalizedData;
        }
        else if(_normalizationState == _normalizationEnum.zScoreRow) {

        }
        else if(_normalizationState == _normalizationEnum.zScoreColumn) {

        }
    }

    /**
     * Validates that a color is a d3.color.
     * @param {String} colorString string representation of a color.
     */
    function validateColor(colorString) {
        color = d3.color(colorString);
        if(color === null || !color.displayable)
            throw "ERROR: Invalid color [" + colorString + "]!";
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
     * Validates that the gene expression data array has data for each region of
     * the brain, and only numerical data.
     */
    function validateGeneExpressionData(data) {

        // Each value in the array is a number.
        for(i = 0; i < data.length; i++) {
            if(typeof data[i] === "number")
                continue;
            else
                throw "ERROR: The data representing gene expression for each region must be numerical!";
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

    function shallowCopyArray(oldArray) {
        return oldArray.slice()
    }

    /**
    * @function Description: Returns data describing how a gene is expressed in a region. 
    * @param {String} gene Gene to get region expression data for.
    * @param {Array} data Array describing how each gene is expressed in each brain region.
    * @param {Array} locationArray Array describing where each gene is located in the data.
    */
    function getGeneData(gene) {
        var location = _locationArray[gene];
        if(gene == "") {
            throw "ERROR: No gene was specified (Empty string)";
        }
        else if(location == null) {
            throw "ERROR: " + gene +" is not a valid gene!";
        }
        else {
            return _geneData[location];
        }
    }
}


