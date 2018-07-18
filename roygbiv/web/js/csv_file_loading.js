/**
 * @function registerRegionCheckboxes registers events for showing or hiding a mesh when the associated
 * checkbox is checked. 
 * @param {brain} brain Brain associated with the events.
 */
function registerRegionCheckboxes(brain) {
    $('.region-select').on('change', function(e) { 
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
 * @function updateRegionDisplay Shows or hides each brain mesh based upon it being checked.
 * @param {string} className 
 * @param {brain} brain 
 */
function updateRegionDisplay(className, brain) {
    $('.'+className).each(function() {
        
        if($(this).is(':checked')) {
            brain.showMeshByName(name);
        }  
        else {
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
 * @param {scope} scope scope containing the brain object.
 * @param {Camera Array} cameraSettingsArray an array containing camera objects, with their setting name as their key.
 **/
function registerBrainCustomizationEvents(scope, cameraManager) {
    
    // Hide brain when user clicks clear
    $('#search-form').on('click', '#clear-regions', function(e) { 
        checkBoxesByClass("region-select", false);
    });
   
    // Show brain when user clicks reset.
    $('#search-form').on('click', '#reset-regions', function(e) { 
        checkBoxesByClass("region-select", true);
    });

    // Register the menu options for selecting a normalization.
    $('#search-form').on('click', '#')

    // Register the button for saving the camera data.
    $('#search-form').on('click', '#camera-button', function(e) {
        try {
            cameraManager.saveCameraSetting(scope.cameraSettingName, scope.brain.camera);
            cameraManager.addLoadSettingsButton(scope.cameraSettingName, scope.brain.camera, "cameraSettings")
        }
        catch (error) {
            scope.cameraStatus = error;
            scope.$apply();
        }
    });
    
    // Register the checkboxes that hide/show the brain.
    registerRegionCheckboxes(scope.brain);
}

/**
 * Sets the default values for our scope.
 * @param {Scope} container Scope that contains the individual elements.
 */
function setupDefaultValues(scope) {
    
    // Sets the default camera position to be {0, 0, 200} x, y, z respectively.
    scope.userMin = 0;
    scope.userMid = 6;
    scope.userMax = 12;
    scope.fileStatus = "Enter the csv file path...";
    scope.geneStatus = "Enter a Gene...";
    scope.cameraPosDisplayX = 0;
    scope.cameraPosDisplayY = 0;
    scope.cameraPosDisplayZ = 200;
    scope.colorPickerR = '#ffffff';
    scope.colorPickerG = '#ffd400';
    scope.colorPickerB = '#ff0000';
    scope.cameraManager = new CameraManager();
    scope.colorStatus = "Enter in 6 digit hexidecimal color codes";
    scope.loadedCSV = false;
    scope.$apply();
}

/**
 * Returns a json file. The json file contains information about where surface files are locatd at.
 * This function returns the json file associated with the user selected surface.
 */
function getSurfaceOption() {
    // Get the surface option the user selects.
    return  document.getElementById("surfaceSelection").value;
}

/**
 * 
 * @param {*} scope 
 * @param {*Dictionary} colorsDict Dictionary containing values for the gene expression colors, associated with the region.
 */
function generateNewBrain(scope, colorsDict) {

    //remove old brain to render new upon user click go
    if (scope.brain) {
        $('#nav-brain').empty();
    }

    scope.cameraManager.clear();

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
        manifest_url: getSurfaceOption(),
        label_mapper: "data/labels.json",
        colors: colorsDict,
    });
    
    updateRegionDisplay("region-select", $scope.brain);
}

function colorChange(event) {
    $('#nav-brain').css("background-color",  event.target.value);
}

function getGeneLocationArray(csvObject, scope) {
    try {
        return getGeneLocDict(csvObject);
    }
    catch (error_message) {
        scope.geneStatus = error_message;
        scope.$apply();
        return;
    }
}

function getCSVPath(scope) {
    var path = $('#upload-path').val();
    if(path == "") {
        $scope.fileStatus = "Empty file path submitted. Please enter a valid file path."
        $scope.$apply();
        return "ERROR: Invalid path!";
    }
    return path;
}

function deployLegend(divID, colorScale) {
    $('#' + divID).empty()
    colorlegend("#" + divID, colorScale, "linear", {title: "Gene Expression"});
}

function registerLoadCSVFileEvent(scope) {
    // Upload is for uploading data on how genes are expressed on different regions of the brain.
    $('#search-form').on('click', '#upload', function(e) { 
        path = getCSVPath(scope);
        d3.csv(path, function(error, csvObject) {
            
            // Get the file path of the users defined file, so we can display it for the user.
            scope.filePath = path;
            
            if(error) {
                // Inform the user that the file failed to load.
                scope.fileStatus = "ERROR failed to upload file!";
                scope.$apply();
                
            } else {
                // Inform the user that the file successfully loaded, and display the path.
                scope.fileStatus = "File uploaded successfully!";
                scope.csvObject = csvObject;
                scope.loadedCSV = true;
                scope.$apply();
            }
        });
    });
}

function getRegionColorArray(scope, proccessedData, geneName) {

    var regionColorFactory = new RegionColorFactory(
        proccessedData, getHeader(), scope.colorPickerR,
        scope.colorPickerG, scope.colorPickerB);

    if(scope.zScoreCheckbox) {
        regionColorFactory.setNormalizationState("zScoreRow");
    }
    try {
        scope.regionColorFactory.setColors(scope.colorPickerR, scope.colorPickerG, scope.colorPickerB);
    } catch (error) {
        scope.minMidMaxStatus = error;
        scope.$apply();
    }
    return regionColorFactory.generateRegionColorArray(geneName);
}

function registerRenderBrainEvent(scope) {
    $('#search-form').on('click', '#search-button', function(e) {
        e.preventDefault();

        if(scope.loadedCSV) {

            var geneName = scope.geneSearch.trim().toUpperCase()
            geneLocationArray = getGeneLocationArray(scope.csvObject, scope); 
            var processedData = cleanData(scope.csvObject, geneLocationArray);
            regionColorArray = getRegionColorArray(scope, processedData, geneName); 

            scope.brain = generateNewBrain(scope, regionColorArray);

            deployLegend("nav_legend", colorScale);
            checkBoxesByClass("region-select", true);
            registerBrainCustomizationEvents(scope, scope.cameraManager);
        }
        else {
            scope.fileStatus = "ERROR: Upload a csv file before trying to upload region data!";
            scope.$apply();
        }
    });
}

// Set up the module/controller for Uploading the Brain CSV file, and displaying the brain based off of the
// Main entry point for the application
// gene of interest.
angular.module('navigator', []).controller('NavigateController', ['$scope', function($scope) {

    setupDefaultValues($scope);

    // Load CSV file containing gene expression data for the brain regions.
    registerLoadCSVFileEvent($scope);

    // Events associated with rendering the brain and selection options.
    registerRenderBrainEvent($scope);

}]);