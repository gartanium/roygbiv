/*
 * Summary.
 * Functionality for building an associative array of colors that describes how genes are
 * expressed on different regions of the brain.
 * 
 * Description.
 * Contains functionalities for customizing how the associative array of colors 
 * is built. Such normalization options include z-score normilization, scaling with min-mid-max
 * options, and relative for the given gene expression data.
 * 
 * @file this file defines a RegionColorFactory object.
 * @author Matthew Brown
 * @since 06.08.18
 */

 /**
  * 
  * @param {Array} data Associative array containing genes as the key, and an array for region data. 
  * @param {Array} header Associative array describing what region of the brain each column represents in the data object. 
  * The key should be a numerical ID and the value should be the name of the region. 
  * @param {String} minColor Minimum color value on the scale.
  * @param {String} midColor Middle color value on the scale.
  * @param {String} maxColor Maximum color value on the scale.
  */
function RegionColorFactory(data, header, minColor, midColor, maxColor) {

    var _colorMin = minColor;
    var _colorMid = midColor;
    var _colorMax = maxColor;

    var _colorScale;

    var _geneData = data;

    var _normalizedData = [];       
    var _normalizationState = 0;
    var _normalizationEnum = {
        default: 0,
        zScoreRow: 1,
        zScoreColumn: 2
    }

    var _header = header;

    /**
    * Sets the color values to be displayed.
    * @param {String} minColor Minimum color value on the scale.
    * @param {String} midColor Middle color value on the scale.
    * @param {String} maxColor Maximum color value on the scale.
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
     * Returns a dictionary of colors for representing how a gene is expressed
     * @param {String} gene Gene to be represented. 
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
        var minMidMax = findMinMidMax(_normalizedData);
        _min = minMidMax[0];
        _mid = minMidMax[1];
        _max = minMidMax[2];

        // Generate the color scale
        colorScale = buildColorScale(_min, _mid, _max, _colorMin, _colorMid, _colorMax);
       
        // Build the Color Array.
        colorArray = buildColorArray(colorScale, _normalizedData, _header);

        return colorArray;
    }

    /**
     * Returns the color scale associated with the factory.
     */
    this.getColorScale = function() {
        return _colorScale;
    }

    function findMinMidMax(array) {

        var newArray = [];
        var counter = 0;
        for(var key in array) {
            newArray[counter] = array[key];
            counter += 1;
        }

        var min = Math.min.apply(Math, newArray);
        var mid = mean(newArray);
        var max = Math.max.apply(Math, newArray);

        if(_normalizationState === _normalizationEnum.default) {
            return [min, mid, max];
        }
        else if(_normalizationState === _normalizationEnum.zScoreColumn ||
                _normalizationState === _normalizationEnum.zScoreRow) {

            var standardDeviations = 3;
            if( min < -3) {
                standardDeviations = Math.abs(Math.ceil(min)); 
            }
            else if ( max > 3 && max > Math.abs(min)) {
                standardDeviations = Math.abs(Math.ceil(max));
            }

            return [standardDeviations * -1, 0, standardDeviations];
        }
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
        _normalizedData = [];

        if(typeof _normalizationState == "undefined") {
            throw "ERROR: " + state + " is not a valid option!";
        }
    }

    /**
     * Returns a copy of all the data describing how each gene is expressed over each region,
     * and normalizes the copy.
     */
    function generateNormalizedData(data) {
        var normalizedData;

        if(_normalizationState == _normalizationEnum.default) {
            normalizedData = shallowCopyArray(data);
            return normalizedData;
        }
        else if(_normalizationState == _normalizationEnum.zScoreRow) {

            normalizedData = shallowCopyArray(data);
            
            values = Object.values(normalizedData);
            values = arr.zScores(values);

            var j = 0;
            for(i = 1002; i < 1036; i++) {
                if(normalizedData[i]) {
                    normalizedData[i] = values[j];
                    j++;
                }
            }
            return normalizedData;

        }
        else if(_normalizationState == _normalizationEnum.zScoreColumn) {
            //TODO: ADD LOGIC HERE FORE NORMALIZING BY COLUMN.
            // for every gene..
            // get element at position
            // Build an indexed array to hold the gene.
            // Extract an array containing positions and genes.
            normalizedData = shallowCopyArray(data);
            geneIndexedArray = [];
            valueIndexedArray = [];
            for(var gene in normalizedData) {
                geneIndexedArray.push(gene);
                valueIndexedArray.push(normalizedData[gene][1002])
            }
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
    function buildColorArray(colorScale, data, header) {
        var colorArray = [];
        for(var key in data) {

            var tempFloat = parseFloat(data[key]);
            var colorScaled = colorScale(tempFloat);

            tempColor = d3.color(colorScaled);
            // We want a 0 to 1 scale for the colors.
            red = tempColor.r / 256;
            green =  tempColor.g / 256;
            blue = tempColor.b / 256;

            colorArray[key] = [red, green, blue];
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
        var newArray = [];
        for(var key in oldArray) {
            newArray[key] = oldArray[key];
        }
        return newArray;
    }

    /**
    * @function Description: Returns data describing how a gene is expressed in a region. 
    * @param {String} gene Gene to get region expression data for.
    */
    function getGeneData(gene) {
        if(gene == "") {
            throw "ERROR: No gene was specified (Empty string)";
        }
        else if(!(gene in _geneData)) {
            throw "ERROR: " + gene +" is not a valid gene!";
        }
        else 
            return _geneData[gene];
    }
}


