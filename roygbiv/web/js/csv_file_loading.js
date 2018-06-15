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
function registerEvents(scope, cameraManager) {
    
    // Hide brain when user clicks clear
    $('#search-form').on('click', '#clear-regions', function(e) { 
        checkBoxesByClass("region-select", false);
    });
   
    // Show brain when user clicks reset.
    $('#search-form').on('click', '#reset-regions', function(e) { 
        checkBoxesByClass("region-select", true);
    });

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
 * @function initializeDefaultValues when a new brain is rendered, we set the initial values here.
 */
function initializeDefaultValues() {
    // When the brain is first rendered, we want all region select check boxes to be selected.
    checkBoxesByClass("region-select", true);
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

    container.colorPickerR = '#ffffff';
    container.colorPickerG = '#ffd400';
    container.colorPickerB = '#ff0000';
    container.cameraManager = new CameraManager();

    container.regionColorFactory = new RegionColorFactory();

    container.colorStatus = "Enter in 6 digit hexidecimal color codes";
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
    });
    
    updateRegionDisplay("region-select", $scope.brain);
}

// Set up the module/controller for Uploading the Brain CSV file, and displaying the brain based off of the
// gene of interest.
angular.module('navigator', []).controller('NavigateController', ['$scope', function($scope) {

    setupDefaultValues($scope);
    
    // Upload is for uploading data on how genes are expressed on different regions of the brain.
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
                    var geneRegionDataObject = getRegionDict(geneLoc, csvObject);
                    var geneRegionDataArray = Object.values(geneRegionDataObject);
                    geneRegionDataArray = geneRegionDataArray.map(Number);

                   

                     // Get the color scale and colored data for the Brain.
                     // If the zscore box is checked, use zscore for rendering the brain. Otherwise use min/max.
                    // TODO: Modify code so upon error, it goes not to minMidMaxStatus but something
                    // more general.
                    if($scope.zScoreCheckbox) {

                        $scope.regionColorFactory.setNormalizationStateToZScore();
                    }
                    else {
                        try {
                            $scope.regionColorFactory.setNormalizationStateToMinMidMax($scope.userMin, 
                                $scope.userMid, $scope.userMax);
                            $scope.regionColorFactory.setColors($scope.colorPickerR, $scope.colorPickerG, $scope.colorPickerB);
                        } catch (error) {
                            $scope.minMidMaxStatus = error;
                            $scope.$apply();
                        }
                    }
                    
                    $scope.regionColorFactory.setDataToProcess(geneRegionDataArray);
                    dict = $scope.regionColorFactory.generateRegionColorArray();
                    
                    //render new brain
                    $scope.brain = generateNewBrain($scope, dict);
                    

                    $('#nav_legend').empty()
                    colorlegend("#nav_legend", colorScale, "linear", {title: "Gene Expression"});
                    initializeDefaultValues();  
                    registerEvents($scope, $scope.cameraManager);
                });
            }
        });
    });
}]);

