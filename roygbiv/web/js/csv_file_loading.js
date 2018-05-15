function mean(data) {
    var total = 0;
    length = data.length;
    for (var i = 0; i < length; i += 1) {
        total += data[i];
    }
    return total / data.length;
}

/*
* No idea what this is for.
*/
function assign_regions() {
    /*
    //Intent of the below chunk is to clean data to allow for input into application
    //"headerNames" and "name" are used to make header names the key for the object "name"

    var headerNames = d3.keys(datas[0]);
    var name = {
            "1002": "ctx-lh-caudalanteriorcingulate",
            "1003": "ctx-lh-caudalmiddlefrontal",
            "1005": "ctx-lh-cuneus",
            "1006": "ctx-lh-entorhinal",
            "1007": "ctx-lh-fusiform",
            "1008": "ctx-lh-inferiorparietal",
            "1009": "ctx-lh-inferiortemporal",
            "1010": "ctx-lh-isthmuscingulate",
            "1011": "ctx-lh-lateraloccipital",
            "1012": "ctx-lh-lateralorbitofrontal",
            "1013": "ctx-lh-lingual",
            "1014": "ctx-lh-medialorbitofrontal",
            "1015": "ctx-lh-middletemporal",
            "1016": "ctx-lh-parahippocampal",
            "1017": "ctx-lh-paracentral",
            "1018": "ctx-lh-parsopercularis",
            "1019": "ctx-lh-parsorbitalis",
            "1020": "ctx-lh-parstriangularis",
            "1021": "ctx-lh-pericalcarine",
            "1022": "ctx-lh-postcentral",
            "1023": "ctx-lh-posteriorcingulate",
            "1024": "ctx-lh-precentral",
            "1025": "ctx-lh-precuneus",
            "1026": "ctx-lh-rostralanteriorcingulate",
            "1027": "ctx-lh-rostralmiddlefrontal",
            "1028": "ctx-lh-superiorfrontal",
            "1029": "ctx-lh-superiorparietal",
            "1030": "ctx-lh-superiortemporal",
            "1031": "ctx-lh-supramarginal",
            "1034": "ctx-lh-transversetemporal",
            "1035": "ctx-lh-insula",
            "2002": "ctx-rh-caudalanteriorcingulate",
            "2003": "ctx-rh-caudalmiddlefrontal",
            "2005": "ctx-rh-cuneus",
            "2006": "ctx-rh-entorhinal",
            "2007": "ctx-rh-fusiform",
            "2008": "ctx-rh-inferiorparietal",
            "2009": "ctx-rh-inferiortemporal",
            "2010": "ctx-rh-isthmuscingulate",
            "2011": "ctx-rh-lateraloccipital",
            "2012": "ctx-rh-lateralorbitofrontal",
            "2013": "ctx-rh-lingual",
            "2014": "ctx-rh-medialorbitofrontal",
            "2015": "ctx-rh-middletemporal",
            "2016": "ctx-rh-parahippocampal",
            "2017": "ctx-rh-paracentral",
            "2018": "ctx-rh-parsopercularis",
            "2019": "ctx-rh-parsorbitalis",
            "2020": "ctx-rh-parstriangularis",
            "2021": "ctx-rh-pericalcarine",
            "2022": "ctx-rh-postcentral",
            "2023": "ctx-rh-posteriorcingulate",
            "2024": "ctx-rh-precentral",
            "2025": "ctx-rh-precuneus",
            "2026": "ctx-rh-rostralanteriorcingulate",
            "2027": "ctx-rh-rostralmiddlefrontal",
            "2028": "ctx-rh-superiorfrontal",
            "2029": "ctx-rh-superiorparietal",
            "2030": "ctx-rh-superiortemporal",
            "2031": "ctx-rh-supramarginal",
            "2034": "ctx-rh-transversetemporal",
            "2035": "ctx-rh-insula"
    };

    //Iterate through name and rearrange csv columns by value to map to key
    var names_values = Object.values(name);
    var names_keys = Object.keys(name);

    for (var stuff = 0; stuff < 70; stuff ++) {
        for (var items = 0; items < 62; items++) {
            if (headerNames[stuff] === names_values[items]) {
                headerNames[stuff] = names_keys[items];
            }
        }
    }
    //Data headers converted to keys
    //TO DO:
    //Remove unnecessary columns
    //Build object with key = row number(index) and value = gene
    */
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


/**
 * Function: Returs a d3.scale for the data. Includes a color scale.
 * Data: An object containing data for Gene Expression.
 **/
function getColorScale(data) {
    
    // Convert our data object into an array of floats.
    var values = Object.values(data);
    values = values.map(Number);
    
    // Adjust the precision of each float value in data,
    // so we don't have to many decimels.

    
    //Need to pull values to calculate mid, min, max


    var mid = mean(values),
        min = Math.min(...values);
    var big = Math.max(...values);

    //return scale of colors for min to mid to max values
    var colors = d3.scale.linear()
        .domain([min, mid, big])
        .range(['#ffffff', '#ffd400', '#ff0000']);
    
    return colors;
}

/**
* Function: Returns the location of a gene.
* locationDict: Dictionary containing the genes as keys and locations as values.
* gene: String containing the gene name.
* Validates if a Gene is valid, if not, throws an error.
**/
function getGeneLocation(locationDict, gene) {
    var location = locationDict[0][gene];
    try {
        if(gene == "") {
            throw "ERROR: No gene was specified (Empty string)";
        }
        else if(location == null) {
            throw "ERROR: " + gene +" is not a valid entry";
        }
        else {
            return location;
        }
    }
    catch (errorMsg) {
        throw errorMsg;
    }
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
    for (var j = 1002; j < 1036; j++) {
        if (data[j]) {
            
            red = d3.color(colorsScale(parseFloat(data[j]))).r / 256;
            green =  d3.color(colorsScale(parseFloat(data[j]))).g / 256;
            blue = d3.color(colorsScale(parseFloat(data[j]))).b / 256;
            dict[j] = [red, green, blue];
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

// Set up the module/controller for Uploading the Brain CSV file, and displaying the brain based off of the
// gene of interest.
angular.module('navigator', []).controller('NavigateController', ['$scope', function($scope) {

    $scope.fileStatus = "Enter the csv file path...";
    $scope.geneStatus = "Enter a Gene...";
    $scope.$apply();
    
    // TODO: Functionality for uploading a csv file for the brain.
    $('#search-form').on('click', '#upload', function(e) { 
        var path = $('#upload-path').val();
        
        if(path == "") {
            $scope.fileStatus = "Empty file path submitted. Please enter a valid file path."
            $scope.$apply();
            return;
        }
        
        d3.csv("data/keys.csv", function(keystuff) { 
            d3.csv(path, function(error, datas) {
                
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
                            geneLoc = getGeneLocation(keystuff, geneName)
                        }
                        catch (error_message) {
                            $scope.geneStatus = error_message;
                            $scope.$apply();
                            return;
                        }
                        
                        var data = datas[geneLoc];
                        //console.log(data);

                        // TODO: Color Scheme
                        colorScale = getColorScale(data);
                        dict = getColorDict(data, colorScale);
                        
                        $('#nav_legend').empty();
                        colorlegend("#nav_legend", colorScale, "linear", {title: "Gene Expression Scale"});
                        
                        
                        //remove old brain to render new upon user click go
                        if ($scope.brain) {
                            $('#nav-brain').empty();
                        }

                        //render new brain
                        $scope.brain = new Brain({
                            divID: "nav-brain",  // div to render brain
                            callback: function (mesh) {
                                // callback when a mesh is selected/deselected
                                if (!mesh) {
                                    // deselected: clear label & plot
                                    $scope.selectedLabel = "";

                                    $('#plot-canvas').empty();
                                } else {
                                    // selected: add label, do plot.
                                    $scope.selectedLabel = mesh.name;
                                    do_boxplot("plot-canvas", mesh);

                                }
                                $scope.$apply();
                            },
                            manifest_url: 'data/lh_files_to_load.json',
                            label_mapper: "data/labels.json",
                            colors: dict
                        });   
                        
                        initializeDefaultValues();  
                        registerEvents($scope.brain);
                    });
                }
            });
        });
    });
}]);

