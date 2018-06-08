QUnit.module( "csv_file_loading_test_group" );
QUnit.test( "hello test", function( assert ) {
    assert.ok( 1 == "1", "Passed!" );
  });

  QUnit.test("validate_color_test", function( assert ) {
    assert.ok(validateColor("blue") == "1", "Passed!");
  });

  QUnit.test("min_mid_max_input_validation_test", function( assert ) {

    function tryRaiseThrow(min, mid, max) {
      try {
        validateMinMidMax(min, mid, max) 
        assert.ok(false);
      } catch (error) {
        assert.ok(error == "ERROR: min must be less than mid, and mid must be less than max!");
      }
    }

    function tryNoThrow(min, mid, max) {
      try {
        validateMinMidMax(min, mid, max) 
        assert.ok(true);
      } catch (error) {
        assert.ok(false);
      }
    }

    testThrowArray = [
      [0, 5, 3],
      [0, -3, -5],
      [0, -3, 3],
      [10, 3, 20],
      [10, -3, -5],
      [0, 10, 2]
    ];

    testNoThrowArray = [
      [-3, 0, 10],
      [0, 5, 10],
      [-4, 3, 320],
      [2, 44, 222]
    ];

    for(i = 0; i < testThrowArray.length; i++) {
      tryRaiseThrow(testThrowArray[i][0], testThrowArray[i][1], testThrowArray[i][2]);
    }

    for(i = 0; i < testNoThrowArray.length; i++) {
      tryNoThrow(testNoThrowArray[i][0], testNoThrowArray[i][1], testNoThrowArray[i][2]);
    }

  })