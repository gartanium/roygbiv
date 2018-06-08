QUnit.module("Camera_Test_group");

fakeCamera = new THREE.PerspectiveCamera();

// Validation to make sure that the user doesn't enter in a camera ID to save that is already used.
QUnit.test("validate_new_saved_camera_ID_test", function( assert ) {

    sameIDError="ERROR: a camera is already saved with that ID!";
    emptyStringError="ERROR: You must provide a name for your camera setting!";
    
    function tryRaiseThrow(newID, list, expectedError) {
        try {
            var testCameraManager = new CameraManager();
            testCameraManager.loadSettingsArray(list);
            testCameraManager.saveCameraSetting(newID, fakeCamera) 
            assert.ok(false);
        } catch (error) {
            assert.ok(error == expectedError);
        }
    }

    function tryNoThrow(newID, list) {
        try {
            var testCameraManager = new CameraManager();
            testCameraManager.loadSettingsArray(list);
            testCameraManager.saveCameraSetting(newID, fakeCamera) 
            assert.ok(true);
        } catch (error) {
            assert.ok(false);
        }
    }

    // Validation to make sure that a camera setting is valid even if
    // the list is already empty.
    testList = {};
    tryNoThrow("foo", testList, sameIDError);

    emptyString = "";
    tryRaiseThrow(emptyString, testList, emptyStringError);

    // Validation for throwing and no throwing for all other conditions.
    testList = {
        front : "foo",
        back : "foo",
        side : "foo",
        top : "foo"
    };

    testRaiseThrowList = ["front", "back", "side", "top"];
    testNoThrowlist = ["Bob", "John", "Side2", "foo"];

    for(i = 0; i < testRaiseThrowList.length; i++) {
        tryRaiseThrow(testRaiseThrowList[i], testList, sameIDError);
    }
    
    for(i = 0; i < testNoThrowlist.length; i++) {
        tryNoThrow(testNoThrowlist[i], testList);
    }
      
  });


