/**
 * @function registerRegionCheckboxes registers events for showing or hiding a mesh when the associated
 * checkbox is checked. 
 * @param {brain} brain Brain associated with the events.
 * if you make a change to scope remember to use $scope.$apply()
 * unless you are in a function then you can use scope.$apply()
 */

// call back function for the check boxes to show whichever gene region
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
 * @param {Array} cameraSettingsArray an array containing camera objects, with their setting name as their key.
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
}

//called in the index.html file
function colorChange(event) {
    $('#nav-brain').css("background-color",  event.target.value);
}

// catches if the gene selection has an error and displays it to the screen
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

// error handing for CSV file loading and displays to the screen
function getCSVPath(scope) {
    var path = $('#upload-path').val();
    if(path == "") {
        $scope.fileStatus = "Empty file path submitted. Please enter a valid file path."
        $scope.$apply();
        return "ERROR: Invalid path!";
    }
    return path;
}


// displays the legend to the screen
function deployLegend(divID, colorScale) {
    $('#' + divID).empty()
    colorlegend("#" + divID, colorScale, "linear", {title: "Gene Expression"});
}

// upload the csv button handling
function registerLoadCSVFileEvent(scope) {
    rowDeleteArray = []
    console.log("this is outside")
    // Upload is for uploading data on how genes are expressed on different regions of the brain.
    $('#search-form').on('click', '#get-file', function(e) {
        console.log("I want to pass here")
        console.log("csvarray", csvarray)

        //this is to find empty rows
        for (var i=0; i < csvarray.length; i++){
            if (csvarray[i][0] == ""){
                console.log("found an empty spot", i)
                rowDeleteArray.push(i)
            }
            csvarray[i][0] = csvarray[i][0].concat("\n")
        }

        // this is to delete the empty rows in the csv that were found
        for (var i=0; i < rowDeleteArray.length; i++){
            console.log("delete extra space")
            csvarray.splice(rowDeleteArray[i],1);
        }

        //this breaks up each row into an array of strings separated by commas,
        //then we go through and get rid of leading white space if it was created
        //then we make a make by mapping the column headers to the row value at its spot for
        //each row.
        //it might be good for me to use a reduce method instead of the for loop.
        var d3object = d3.csvParseRows(String(csvarray.slice(1,csvarray.length)), function(d) {
            var ret = {};
            if (d[0] === ""){
                d.shift()
            }
            //console.log(d)
            for (var i = 0; i < d.length; i++){
                ret[csvarray[0][0].trim().split(",")[i]] = d[i]
            }
            return ret;
        });

        // make the completed csv object available to scope
        scope.csvObject = d3object;
        //update the screen display
        scope.fileStatus = "File uploaded successfully!";
        //print the finalized object
        console.log("scope.csvObject", scope.csvObject)
        //update the loaded status
        scope.loadedCSV = true;
        //update all the scope changes that you have made
        scope.$apply();
    });

    //called when you hit Choose file, allows the user to browse for a csv
    $('#search-form').on('click', '#csvFileInput', function(e){
        console.log("well, well, well")
        handleFiles(this.files)
    });



    $('#search-form').on('click', '#upload', function(e) {
        console.log("Upload this")
        //});
        //print("for the love of all things good, yes")
        //console.log(e)
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
                console.log("scope.csvObject", scope.csvObject)
                scope.loadedCSV = true;
                scope.$apply();
            }
        });
    });
}

//if you want to change the colors or normalize the data it is done here
function getRegionColorArray(scope, proccessedData, geneName) {

    var regionColorFactory = new RegionColorFactory(
        proccessedData, getHeader(), scope.colorPickerR,
        scope.colorPickerG, scope.colorPickerB);

    //where you do normalization for your data 
    regionColorFactory.setNormalizationState(scope.normalizationSelection);
    
    try {
        scope.regionColorFactory.setColors(scope.colorPickerR, scope.colorPickerG, scope.colorPickerB);
    } catch (error) {
        scope.minMidMaxStatus = error;
        scope.$apply();
    }
    return regionColorFactory.generateRegionColorArray(geneName);
}

// render button handing
function registerRenderBrainEvent(scope) {
    $('#search-form').on('click', '#search-button', function(e) {
        e.preventDefault();

        if(scope.loadedCSV) {
            // this is where Gene Selection is referenced
            console.log("current csv object", scope.csvObject)
            var geneName = scope.geneSearch.trim().toUpperCase()
            console.log("geneName", geneName)
            geneLocationArray = getGeneLocationArray(scope.csvObject, scope);
            console.log("gene location array", geneLocationArray)
            var processedData = cleanData(scope.csvObject, geneLocationArray);
            console.log("Processed data", processedData)
            // creates the array of colors for the brain
            regionColorArray = getRegionColorArray(scope, processedData, geneName); 

            scope.brain = generateNewBrain(scope, regionColorArray);

            deployLegend("nav_legend", colorScale);
            checkBoxesByClass("region-select", true);
            //anything that is not Gene Selection and is a button is done here
            registerBrainCustomizationEvents(scope, scope.cameraManager);
        }
        else {
            scope.fileStatus = "ERROR: Upload a csv file before trying to upload region data!";
            scope.$apply();
        }
    });
}

//global variable to store the csv file for registerLoadCSVFile
var csvarray = [];
function makeFunction(array) {
    console.log("grabbed the csv from the asyc process")
    csvarray = array;
    console.log(array)
}


//file loading for the csv allows to get csv from their hard drive or network
function handleFiles(files) {
      // Check for the various File API support.
  if (window.FileReader) {
          // FileReader are supported.
      var lines = getAsText(files[0]);
      return lines;
  } else {
      alert('FileReader are not supported in this browser.');
  }
}

function getAsText(fileToRead) {
  var reader = new FileReader();
      // Read file into memory as UTF-8
    reader.onerror = errorHandler;
    reader.onload = loadHandler;
    reader.readAsText(fileToRead);
    //reader.readAsText(fileToRead);
    console.log("start")
    console.log("done")

      // Handle errors load
    reader.onload();
}

function loadHandler(event) {
  var csv = event.target.result;
  processData(csv);
}

function processData(csv) {
    var allTextLines = csv.split(/\r\n|\n/);
    var lines = [];
    for (var i=0; i<allTextLines.length; i++) {
        var data = allTextLines[i].split(';');
            var tarr = [];
            for (var j=0; j<data.length; j++) {
                tarr.push(data[j]);
            }
            lines.push(tarr);
    }
  console.log("process data log",lines);
  makeFunction(lines)
}

function errorHandler(evt) {
  if(evt.target.error.name == "NotReadableError") {
      alert("Cannot read file !");
  }
}



// Set up the module/controller for Uploading the Brain CSV file, and displaying the brain based off of the
// Main entry point for the application
// gene of interest.
angular.module('navigator', []).controller('NavigateController', ['$scope', function($scope) {

    setupDefaultValues($scope);

    // Load CSV file containing gene expression data for the brain regions.
    //this is where the "Upload" button is called
    registerLoadCSVFileEvent($scope);

    // Events associated with rendering the brain and selection options.
    // This is where the render button is called

    registerRenderBrainEvent($scope);

}]);
