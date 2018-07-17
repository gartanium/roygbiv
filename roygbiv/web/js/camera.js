/**
 * Summary.
 * Functionality for saving and retrieving camera settings, and load buttons.
 * 
 * Description.
 * Contains functions for saving camera objects, and restoring them to a persistent 
 * object. In addition, contains functionality for linking a camera button and
 * a stored camera setting.
 * 
 * @file this file defines CameraManager objects.
 * @author Matthew Brown
 * @since 06.08.18
 */

 /**
  * Function class Constructor.
  * Handles logic for saving, loading, and creating load camera settings buttons.
  */
function CameraManager() {

    /**
     * Contains a key-value pair of strings for keys and values of three.PerspectiveCameras.
     */
    this.cameraSettingsArray = {};

    /**
     * Creates a button for loading camera settings. Saves the associated camera settings in the array,
     * and registers the events for loading the camera settings.
     * @param {*} settingID ID of the button to save.
     * @param {*} cameraSettingsArray Array to store the camera settings in.
     * @param {*} camera Persistent camera to restore the settings to.
     * @param {*} loadButtonTable Table containing all the load camera buttons.
     */
    this.storeNewSetting = function(settingID, camera, loadButtonTableID) {
        addLoadCameraSettingButton(settingID, loadButtonTableID);
        addLoadCameraSettingsEvent(settingID, this.cameraSettingsArray, camera);
    }

    /**
     * Load an associative array of camera settings into the cameraManager.
     * @param {Three.PerspectiveCamera Associative Array} settingsArray 
     */
    this.loadSettingsArray = function(settingsArray) {
        this.cameraSettingsArray = settingsArray;
    }

        /**
     * Saves a camera setting with the associated ID to the manager.
     * @param {String} settingID ID of the camera setting.
     * @param {THREE.camera} camera Camera whose settings are to be saved.
     * @param {Array} cameraSettingList List of Camera settings.
     */
    this.saveCameraSetting = function(settingID, camera) {
        try {
            validateNewSavedCameraID(settingID, this.cameraSettingsArray);
            deepCopyObjectToArray(camera, this.cameraSettingsArray, settingID);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Connects a stored camera setting to a button, so that when the button is pressed,
     * a persistent cameras settings are set to the saved settings.
     * @param {String} settingID ID of the camera settings to be associated with the button.
     * @param {THREE.PerspectiveCamera} camera Persistent camera to be updated upon load
     *  button pressed.
     * @param {String} table ID of the table to append the Load setting Button to. 
     */
    this.addLoadSettingsButton = function(settingID, camera, tableID) {
        insertHTMLButton(settingID, tableID);
        registerLoadCameraSettingsEvent(settingID, this.cameraSettingsArray, camera);
    }

    /**
     * Deep copies and object and appends it to an associate array. Gives it the key of the length of the Associative Array.
     * @param {Object} object 
     * @param {Associative Array} objectArray Associative array where objects are stored.
     * @param {String} key A key that will be used to find the specific object in the array.
     */
    function deepCopyObjectToArray(object, objectArray, key) {
        var copiedObject = object.clone();
        objectArray[key] = copiedObject;
    }

    /**
     * Copies several properties from the old camera into the new one.
     * @param {Three.PerspectiveCamera} cameraNew Camera to store the values into.
     * @param {Three.PerspectiveCamera} cameraOld Camera to retrieve the values from.
     */
    function copyCameraProperties(cameraNew, cameraOld) {
        
        // Camera properties to save.
        var properties = ["children", "quaternion", "aspect", "matrix", "matrixWorld", "position", "projectionMatrix", "quaternion", "rotation", "modelViewMatrix"];

        for(var index in properties) {
            cameraNew[index] = jQuery.extend(true, {}, cameraOld[index]);
        }
    }

    /**
     * Validate that a given ID is not in the list of camera settings, so we can save it.
     * In addition, makes sure that the cameraID is not an empty string.
     * @param {string} cameraID ID to save camera setting as.
     * @param {*} cameraArray List of all the saved camera settings.
     */
    function validateNewSavedCameraID(cameraID, cameraArray) {

        if(cameraID in cameraArray) {
            throw "ERROR: a camera is already saved with that ID!";
        }
        else if(cameraID == "") {
            throw "ERROR: You must provide a name for your camera setting!";
        }
        else
            return;
    }

    /**
     * Removes a camera setting from the list based off of it's ID.
     * @param {String} settingID ID of the camera setting.
     * @param {*} cameraSettingList List of camera settings.
     */
    function removeCameraSettingObject(settingID, cameraSettingList) {
        
    }

    /**
     * Adds a camera setting button to a table.
     * @param {String} settingID ID of the camera setting. 
     * @param {String} tableID Table to send the camera button to.
     */
    function insertHTMLButton(settingID, tableID) {

        // Table to add the button to.
        var table = document.getElementById(tableID);

        // Create an empty <tr> element and add it to the 1st position of the table:
        var row = table.insertRow(0);

        // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);

        // Add some text to the new cells:
        cell1.innerHTML = settingID;
        cell2.innerHTML = "<button class=\"cameraSettingsButton\" id =\"" + 
                            settingID + "\">Go</button>";
    }

    /**
     * Adds a load event to a button with the settingID. Makes it so when the button is clicked,
     * the saved camera settings with the settingID is restored to the persistent camera.
     * @param {*} settingID ID of both the camera setting and the button associated with it.
     * @param {*} cameraSettingsArray Array of stored camera settings.
     * @param {*} camera The persistent camera to have the settings restored to.
     */
    function registerLoadCameraSettingsEvent(settingID, cameraSettingsArray, camera) {
        // Register the event for when a load camera button is pressed.
        $('#search-form').on('click', '#'+settingID, function(e) {
        
            //var properties = ["aspect", "matrix", "matrixWorld", "position", "projectionMatrix", "quaternion", "rotation", "modelViewMatrix"];
            var properties = ["up", "position", "rotation", "matrix", "projectionMatrix", "quaternion"];

            for(i = 0; i < properties.length; i++) {
                index = properties[i];
                
                property = cameraSettingsArray[this.id][index].clone();
                camera[index].copy(property); 
            }
        
            copyCameraProperties(cameraSettingsArray[this.id], camera);
            camera.updateProjectionMatrix();
            //scope.brain.camera = cameraSettingsArray[this.id].clone();
            //for(var k in cameraSettingsArray[this.id]) scope.brain.camera[k]=cameraSettingsArray[this.id][k];
        })
    }

    /**
     * Removes a camera setting from the given div.
     * @param {*} settingID Camera setting ID.
     * @param {*} divTargetID Div to remove button from.
     */
    function removeLoadCameraSettingButton(settingID, divTargetID) {

    }
};
    
