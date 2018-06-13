QUnit.module("Region_Color_Factory_Test_group");
  
  QUnit.test("setDataToProcess", function(assert) {
    var testObj = new RegionColorFactory();
    validTestData = [1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3];
    invalidTestData = [1];

    invalidTestData2 = [
      "foo", "dog", "apple", "cat", "dad","foo", "dog", "apple", "cat", "dad",
      "foo", "dog", "apple", "cat", "dad","foo", "dog", "apple", "cat", "dad",
      "foo", "dog", "apple", "cat", "dad","foo", "dog", "apple", "cat", "dad",
      "31"
    ]

    // make sure that we are not able to pass in invalid data.
    //assert.throws(factory.setDataToProcess(testData), "foo", "Invalid gene data!");
    var reg = "error{1}"
    
    // Ensure that we can't have more or less data than the number of brain regions that
    // we are interested in.
    try {
      testObj.setDataToProcess(invalidTestData)
      assert.ok(false);
    }
    catch (error) {
      assert.ok(error == "ERROR: You must provide data for 31 brain regions!");
    }

    // Ensure that non-numerical data throws an error.
    try {
      testObj.setDataToProcess(validTestData);
      assert.ok(true);
    } catch (error) {
      assert.ok(false);
    }
    try {
      testObj.setDataToProcess(invalidTestData2);
      assert.ok(false);
    } catch(error) {
      assert.ok(error === "ERROR: The data represinting gene expression for each region must be"+
      " numerical!");
    }
    
  
  });


 