/**
 * Deep copies and object and appends it to an associate array. Gives it the key of the length of the Associative Array.
 * @param {Object} object 
 * @param {*Associative Array} list 
 * @param {String} key A key that will be used to find the specific object in the array.
 */
function deepCopyObjectToList(object, list, key) {

    var copiedObject = object.clone();
    list[key] = copiedObject;
}

function copyCameraProperties(cameraNew, cameraOld) {
      

        // Camera properties to save.
        var properties = ["children", "quaternion", "aspect", "matrix", "matrixWorld", "position", "projectionMatrix", "quaternion", "rotation", "modelViewMatrix"];

        for(var index in properties) {
            cameraNew[index] = jQuery.extend(true, {}, cameraOld[index]);
        }

        
        /*for(var k in cameraOld) {
            if($.isFunction(k) !== false) {
                cameraNew[k] = jQuery.extend(true, {}, cameraOld[k]);
            }
        }
        cameraNew.updateProjectionMatrix();
        return cameraNew;*/
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
 * Saves a camera object to an array of camera objects, and gives it a key of settingID.
 * @param {String} settingID ID of the camera setting.
 * @param {THREE.camera} camera Camera whose settings are to be saved.
 * @param {Array} cameraSettingList List of Camera settings.
 */
function saveCameraSetting(settingID, camera, cameraSettingsArray) {
    
    try {
        validateNewSavedCameraID(settingID, cameraSettingsArray);
        deepCopyObjectToList(camera, cameraSettingsArray, settingID);
    } catch (error) {
        throw error;
    }
    
}

/**
 * Removes a camera setting from the list based off of it's ID.
 * @param {String} settingID ID of the camera setting.
 * @param {*} cameraSettingList List of camera settings.
 */
function removeCameraSettingObject(settingID, cameraSettingList) {

}

/**
 * Adds a camera setting button to a div.
 * @param {String} settingID ID of the camera setting. 
 * @param {String} tableID Table to send the camera button to.
 */
function addLoadCameraSettingButton(settingID, tableID) {

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
function addLoadCameraSettingsEvent(settingID, cameraSettingsArray, camera) {
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
 * Creates a button for loading camera settings. Saves the associated camera settings in the array,
 * and registers the events for loading the camera settings.
 * @param {*} settingID ID of the button to save.
 * @param {*} cameraSettingsArray Array to store the camera settings in.
 * @param {*} camera Persistent camera to restore the settings to.
 * @param {*} loadButtonTable Table containing all the load camera buttons.
 */
function setupCameraButton(settingID, cameraSettingsArray, camera, loadButtonTable) {
    validateNewSavedCameraID(settingID, cameraSettingsArray)
    saveCameraSetting(settingID, camera, cameraSettingsArray);
    addLoadCameraSettingButton(settingID, loadButtonTable);
    addLoadCameraSettingsEvent(settingID, cameraSettingsArray, camera);
}

/**
 * Removes a camera setting from the given div.
 * @param {*} settingID Camera setting ID.
 * @param {*} divTargetID Div to remove button from.
 */
function removeLoadCameraSettingButton(settingID, divTargetID) {

}