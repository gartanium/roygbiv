QUnit.module("Camera_Test_group");

// Validation to make sure that the user doesn't enter in a camera ID to save that is already used.
QUnit.test("validate_new_saved_camera_ID_test", function( assert ) {
    
    function tryRaiseThrow(newID, list) {
        try {
            validateNewSavedCameraID(newID, list) 
            assert.ok(false);
        } catch (error) {
            assert.ok(error == "ERROR: a camera is already saved with that ID!");
        }
    }

    function tryNoThrow(newID, list) {
        try {
            validateNewSavedCameraID(newID, list) 
            assert.ok(true);
        } catch (error) {
            assert.ok(false);
        }
    }

    // Validation to make sure that a camera setting is valid even if
    // the list is already empty.
    testList = {};
    tryNoThrow("foo", testList);

    // Validation to make sure we cannot put in an empty string.
    try {
        emptyString = "";
        validateNewSavedCameraID(emptyString, testList);
        assert.ok(false);
    } catch (error) {
        assert.ok(error == "ERROR: You must provide a name for your camera setting!");
    }

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
        tryRaiseThrow(testRaiseThrowList[i], testList);
    }
    
    for(i = 0; i < testNoThrowlist.length; i++) {
        tryNoThrow(testNoThrowlist[i], testList);
    }
      
  });


