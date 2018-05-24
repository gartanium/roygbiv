function mean(data) {
    var total = 0;
    length = data.length;
    for (var i = 0; i < length; i += 1) {
        total += data[i];
    }
    return total / data.length;
}

/**
* Function: Applys a precision to an array of floats.
* floatArray: An array of floats
* Precision: Precision of each float in the array (Number of integers after the   * * comma).
* Return: Returns an adjusted array.
**/
function adjustPrecision(floatArray, precision) {
    for (var i = 0; i < length; i+=1) {
        floatArray[i] = parseFloat(floatArray[i].toFixed(precision));
    }
    
    return floatArray;
}

/**
* Function: Adjusts the precision of a float primative
* Value: Float primative
* Precision: Decimal Precision
**/
function adjustSinglePrecision(value, precision) {
    return parseFloat(value.toFixed(precision));
}

/*function calculateMinMidMax(data) {
    // Convert our data object into an array of floats.
    var values = Object.values(data);
    values = values.map(Number);
        var mid = mean(values),
        min = Math.min(...values);
    var big = Math.max(...values);
    
}*/

/**
 * Function: Returs a d3.scale for the data. Includes a color scale.
 * Data: An object containing data for Gene Expression.
 **/
function getColorScale(min, mid, max, data) {
    
    //return scale of colors for min to mid to max values
    var colors = d3.scale.linear()
        .domain([min, mid, max])
        .range(['#ffffff', '#ffd400', '#ff0000']);
    
    return colors;
}
        
/**
 * Function: Returns a dictionary containing colors for different regions of the Brain.
 * Scale: A d3.scale 
 * Data: An array of floats containing Gene Expression data.
**/
function getColorDict(data, colorsScale) {
    
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
 * Function: Registers an event for all the region-select checkboxes
 * that displays or hides the specific region of the brain.
 * Brain: The brain object
**/
function registerRegionCheckboxes(brain) {
    $('#region-selection').on('change', '#region-select', function(e) { 
        name = this.name;
        if(this.checked) {
            brain.showMeshByName(name);
        }
        else
        {
            brain.hideMeshByName(name);
        }
    });
}

/**
 * @function checkBoxesByClass Any checkbox with the given class is checked or unchecked, 
 * and the associated event, change, is fired.
 * @param {*String} className The Class of the checkboxes
 * @param {*Bool} boolChecked determines if the box is to be checked or unchecked. True=Check it, False=Uncheck 
 */
function checkBoxesByClass(className, boolChecked) {
    
    $('.'+className).each(function() {
        $(this).prop('checked', boolChecked);
        $(this).change();
    });

}

/** 
 * @function registerEvents Registers events associated with the brain.
 * @param {brain} brain Brain to be rendered to the screen. 
 **/
function registerEvents(brain) {
    // Hide brain when user clicks clear
    $('#search-form').on('click', '#clear-regions', function(e) { 
        checkBoxesByClass("region-select", false);
    });
    // Show brain when user clicks reset.
    $('#search-form').on('click', '#reset-regions', function(e) { 
        checkBoxesByClass("region-select", true);
    });
    
    // Register the checkboxes that hide/show the brain.
    registerRegionCheckboxes(brain);

    // Register downloading the brain SVG
    registerDownloadSVG();
}

// Used for downloading SVGS
function registerDownloadSVG() {
    d3.select("#download").on("click", function() {
        d3.select(this)
          .attr("href", 'data:application/octet-stream;base64,' + btoa(d3.select("#line").html()))
          .attr("download", "viz.svg") 
      })
}

/**
 * @function initializeDefaultValues when a new brain is rendered, we set the initial values here.
 */
function initializeDefaultValues() {
    // When the brain is first rendered, we want all region select check boxes to be selected.
    checkBoxesByClass("region-select", true);
}

/**
 * @function setups the camera, so that when the brain renders, it renders
 * at the user defined position.
 */
function setupCamera(container) {

    container.brain.camera.position.x = container.cameraX
    container.brain.camera.position.y = container.cameraY
    container.brain.camera.position.z = container.cameraZ
}

/**
 * Sets the default values for our scope.
 * @param {Scope} container Scope that contains the individual elements.
 */
function setupDefaultValues(container) {
    
    // Sets the default camera position to be {0, 0, 200} x, y, z respectively.
    container.cameraX = 0;
    container.cameraY = 0;
    container.cameraZ = 200;
    container.userMin = 0;
    container.userMid = 6;
    container.userMax = 12;
    container.fileStatus = "Enter the csv file path...";
    container.geneStatus = "Enter a Gene...";
    container.cameraPosDisplayX = 0;
    container.cameraPosDisplayY = 0;
    container.cameraPosDisplayZ = 200;
    container.$apply();
}

/**
 * 
 * @param {*} scope 
 * @param {*Dictionary} colorsDict Dictionary containing values for the gene expression colors, associated with the region.
 */
function renderBrain(scope, colorsDict) {

    //remove old brain to render new upon user click go
    if (scope.brain) {
        $('#nav-brain').empty();
    }

    return new Brain({
        divID: "nav-brain",  // div to render brain
        callback: function (mesh) {
            // callback when a mesh is selected/deselected
            if (!mesh) {
                // deselected: clear label & plot
                scope.selectedLabel = "";

                $('#plot-canvas').empty();
            } else {
                // selected: add label, do plot.
                scope.selectedLabel = mesh.name;
                do_boxplot("plot-canvas", mesh);

            }
            scope.$apply();
        },
        manifest_url: 'data/lh_files_to_load.json',
        label_mapper: "data/labels.json",
        colors: colorsDict,
        onAnimation: function (camera) { // Call back function so that the camera position                                  
                                         // is displayed for the user to see.
            scope.cameraPosDisplayX = camera.position.x;
            scope.cameraPosDisplayY = camera.position.y;
            scope.cameraPosDisplayZ = camera.position.z;
            scope.$apply();
        }
    });   
}

// Set up the module/controller for Uploading the Brain CSV file, and displaying the brain based off of the
// gene of interest.
angular.module('navigator', []).controller('NavigateController', ['$scope', function($scope) {

    setupDefaultValues($scope);
    
    $('#search-form').on('click', '#upload', function(e) { 
        var path = $('#upload-path').val();
        if(path == "") {
            $scope.fileStatus = "Empty file path submitted. Please enter a valid file path."
            $scope.$apply();
            return;
        }
        d3.csv(path, function(error, csvObject) {
            
            // Get the file path of the users defined file, so we can display it for the user.
            $scope.filePath = path;
            
            if(error) {
                // Inform the user that the file failed to load.
                $scope.fileStatus = "ERROR failed to upload file!";
                $scope.$apply();
                
            } else {
                
                // Inform the user that the file successfully loaded, and display the path.
                $scope.fileStatus = "File uploaded successfully!";
                $scope.$apply();

                //attempt at making an input bar for genes
                // Load a new brain when the user clicks Go
                $('#search-form').on('click', '#search-button', function(e) {
                    e.preventDefault();

                    //Currently, values in 'keyObj' and indexes in 'datas' are identical
                    var geneName = $scope.geneSearch.trim().toUpperCase()
                    var geneLoc;

                    // Attempt to get the Gene from the User. Throw a message if it fails.
                    try {
                        geneLocDictionary = getGeneLocDict(csvObject);
                        geneLoc = getGeneLocation(geneLocDictionary, geneName);
                    }
                    catch (error_message) {
                        $scope.geneStatus = error_message;
                        $scope.$apply();
                        return;
                    }

                    // Get the brain data related to the specific Gene Location.
                    var geneRegionData = getRegionDict(geneLoc, csvObject);
                    var values = Object.values(geneRegionData);
                    values = values.map(Number);

                     // Get the color scale and colored data for the Brain.
                     // If the zscore box is checked, use zscore for rendering the brain. Otherwise use min/max.
                    if($scope.zScoreCheckbox) {

                        // normalize the region specific data using the z-score.

                        values = applyZScore(values);
                        colorScale = getColorScale(Math.min.apply(Math, values), 0, Math.max.apply(Math, values));
                    }
                    else {
                        colorScale = getColorScale($scope.userMin, $scope.userMid, $scope.userMax);
                    }
                    
                    // Get the dictionary containing color values for each region of the brain according to our scale we made.
                    dict = getColorDict(values, colorScale);
                    
                    //render new brain
                    $scope.brain = renderBrain($scope, dict);
                    
                    
                    $('#nav_legend').empty()
                    colorlegend("#nav_legend", colorScale, "linear", {title: "Gene Expression"});
                    setupCamera($scope);
                    initializeDefaultValues();  
                    registerEvents($scope.brain);
                });
            }
        });
    });
}]);

