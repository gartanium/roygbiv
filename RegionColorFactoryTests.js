QUnit.module("Region_Color_Factory_Test_group");

  QUnit.test("Gene Selection Tests", function(assert) {

      var geneLocations = {
        FOO: 0,
        BOB: 1,
        FOX: 2
      };
    
    // Make sure the user enters in valid gene data.
    try {
      var gene = "SAY";
      var testObj = new RegionColorFactory();
      testObj.setGeneKey(geneLocations);
      testObj.setGene(gene);
      assert.ok(false);
    } catch(error) {
      assert.ok(error == "ERROR: " + gene + " is not a valid gene!");
    }
    try {
      var gene = "";
      var testObj = new RegionColorFactory();
      testObj.setGeneKey(geneLocations);
      testObj.setGene(gene);
      assert.ok(false);
    } catch(error) {
      assert.ok(error == "ERROR: No gene was specified (Empty string)");
    }
  });
  
  QUnit.test("Data Processing Tests", function(assert) {
    
    validTestData = [1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3];
    invalidTestData = [1];
    invalidTestData2 = [
      "foo", "dog", "apple", "cat", "dad","foo", "dog", "apple", "cat", "dad",
      "foo", "dog", "apple", "cat", "dad","foo", "dog", "apple", "cat", "dad",
      "foo", "dog", "apple", "cat", "dad","foo", "dog", "apple", "cat", "dad",
      "31"
    ];
    var geneLocations = {
        FOO: 0,
        BOB: 1,
        FOX: 2
      };
    var geneExpressionData = [validTestData, validTestData, validTestData];

    // make sure that we are not able to pass in invalid data.
    //assert.throws(factory.setDataToProcess(testData), "foo", "Invalid gene data!");
    var reg = "error{1}"
    
    // Ensure that region specific data is numerical.
    try {
      var testObj = new RegionColorFactory();
      testObj.setDataToProcess(invalidTestData2);
      assert.ok(false);
    } catch(error) {
      assert.ok(error === "ERROR: The data represinting gene expression for each region must be"+
      " numerical!");
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

    // Ensure that colors are generated appropriatly, for the min-mid-max normalization.
    var testObj = new RegionColorFactory();
    validTestData2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 10, 10, 10, 10,
    10, 10, 10, 10, 10, 10, 10];
    testObj.setNormalizationStateToMinMidMax(0, 5, 10);
    testObj.setDataToProcess(validTestData2);
    testObj.setColors("#ff0000", "#00ff00", "#0000ff");
    var actual = testObj.generateRegionColorArray();
    var expected = 0.99609375; // Decimal corresponding to ff. Whenever test data is equal to min mid or max,
    for(i = 0; i < 10; i++) {  // there should be a coressisponding ff or 0.99609375 value.
      assert.ok(actual[i][0] == expected);
    }
    for(i = 10; i < 20; i++) {
      assert.ok(actual[i][1] == expected);
    }
    for(i = 20; i < 31; i++) {
      assert.ok(actual[i][2] == expected);
    }

  });


 