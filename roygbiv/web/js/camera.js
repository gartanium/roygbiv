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

function copyCameraProperties(cameraOld, cameraNew) {
        cameraNew.position.x = cameraOld.position.x;
        cameraNew.position.y = cameraOld.position.y;
        cameraNew.position.z = cameraOld.position.z;
}

/**
 * Saves a camera position, stores it in memory, and creates a button for it.
 * @param {String} targetDivID Target div ID where a new camera button will appear.
 * @param {String} settingID ID of the camera setting.
 * @param {THREE.camera} camera Camera whose settings are to be saved.
 * @param {Array} cameraSettingList List of Camera settings.
 */
function saveCameraSettingObject(targetDivID, settingID, camera, cameraSettingList) {

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
 * @param {*} divTargetID Target to send the camera button to.
 */
function addCameraSettingButton(settingID, divTargetID) {

}

/**
 * Removes a camera setting from the given div.
 * @param {*} settingID Camera setting ID.
 * @param {*} divTargetID Div to remove button from.
 */
function removeCameraSettingButton(settingID, divTargetID) {

}