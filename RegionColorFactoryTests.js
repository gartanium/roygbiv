QUnit.module("Region_Color_Factory_Test_group");
  
  QUnit.test("setDataToProcess", function(assert) {
    
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
      var testObj = new RegionColorFactory();
      testObj.setDataToProcess(invalidTestData)
      assert.ok(false);
    }
    catch (error) {
      assert.ok(error == "ERROR: You must provide data for 31 brain regions!", "Exact number of"+
      " brain regions test PASSED!");
    }

    // Ensure that non-numerical data throws an error.
    try {
      var testObj = new RegionColorFactory();
      testObj.setDataToProcess(validTestData);
      assert.ok(true, "Numerical data doesn't throw test PASSED!");
    } catch (error) {
      assert.ok(false, "Numerical data doesn't throw test FAILED!");
    }
    try {
      var testObj = new RegionColorFactory();
      testObj.setDataToProcess(invalidTestData2);
      assert.ok(false);
    } catch(error) {
      assert.ok(error === "ERROR: The data represinting gene expression for each region must be"+
      " numerical!", "Non-numerical data throws test PASSED!");
    }
    
    // input validation for min, mid, and max.
    try {
      var testObj = new RegionColorFactory();
      testObj.setNormalizationStateToMinMidMax(-1, -5, 0);
      assert.ok(false);
    } catch (error) {
      assert.ok(error === "ERROR: min must be less than mid, and mid must be less than max!", 
        "min-mid-max input validation PASSED!")
    }

    // Ensure that the user has chosen a state for the factory.
    try {
      var testObj = new RegionColorFactory();
      testObj.setDataToProcess(validTestData);
      colorArray = testObj.generateRegionColorArray();
      assert.ok(false, "Assert user must call normalizing function first FAILED!");
    } catch (error) {
      assert.ok(error === "ERROR: The factory does not have a normalization state!", "Assert user" +
      " must call normalizing function first PASSED!");
    }

    // Ensure the user has passed in gene expression data.
    try {
      var testObj = new RegionColorFactory();
      testObj.setNormalizationStateToZScore();
      testObj.generateRegionColorArray();
      assert.ok(false, "GeneExpressionDataPassedInTest");
    } catch (error) {
      assert.ok(error === "ERROR: Gene expression data for a region must be loaded into"+
      " the factory class!");
    }

    // Ensure that the user has set the colors for the scale.
    try {
      var testObj = new RegionColorFactory();
      testObj.setNormalizationStateToZScore();
      testObj.setDataToProcess(validTestData);
      testObj.generateRegionColorArray();
      assert.ok(fail, "ColorScaleTest");
    } catch (error) {
      assert.ok(error === "ERROR: The factory does not have a set color scale!", 
        "ColorScaleTest");
    }

    // Ensure no errors are thrown when all conditions are met.
    try {
      var testObj = new RegionColorFactory();
      testObj.setNormalizationStateToZScore();
      testObj.setDataToProcess(validTestData);
      testObj.setColors("#ffffff", "#ff00ff", "#000000");
      testObj.generateRegionColorArray();
      assert.ok(true, "GeneExpressionDataPassedInTest2");
    } catch (error) {
      assert.ok(false, "GeneExpressionDataPassedInTest2");
    }
  });


 