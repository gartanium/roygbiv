QUnit.module("Region_Color_Factory_Test_group");

  QUnit.test("Gene Selection Tests", function(assert) {

    validTestData = [1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3];
    invalidTestData = [1];

    invalidTestData2 = [
      "foo", "dog", "apple", "cat", "dad","foo", "dog", "apple", "cat", "dad",
      "foo", "dog", "apple", "cat", "dad","foo", "dog", "apple", "cat", "dad",
      "foo", "dog", "apple", "cat", "dad","foo", "dog", "apple", "cat", "dad",
      "31"
    ]
      
      var geneLocations = {
        FOO: 0,
        BOB: 1,
        FOX: 2
      };
    
    // Make sure the user enters in valid gene data.
    try {
      var gene = "SAY";
      var testObj = new RegionColorFactory(validTestData, geneLocations);
      testObj.generateRegionColorArray(gene)
      assert.ok(false);
    } catch(error) {
      assert.ok(error == "ERROR: " + gene + " is not a valid gene!");
    }
    try {
      var gene = "";
      var testObj = new RegionColorFactory(validTestData, geneLocations);
      testObj.generateRegionColorArray(gene);
      assert.ok(false);
    } catch(error) {
      assert.ok(error == "ERROR: No gene was specified (Empty string)");
    }
  });
  
  QUnit.test("Data Processing Tests", function(assert) {
    
    var minColor = "#ff0000";
    var midColor = "#00ff00";
    var maxColor = "#0000ff";

    validTestData = [ 
      [1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3]
    ];

    invalidTestData = [
      [1]
    ];

    var geneLocations = {
      FOO: 0,
      BOB: 1,
      FOX: 2
    };

    invalidTestData2 = [
      ["foo", "dog", "apple", "cat", "dad","foo", "dog", "apple", "cat", "dad",
      "foo", "dog", "apple", "cat", "dad","foo", "dog", "apple", "cat", "dad",
      "foo", "dog", "apple", "cat", "dad","foo", "dog", "apple", "cat", "dad",
      "31"]
    ]

    // Ensure that non-numerical data throws an error.
    try {
      var testObj = new RegionColorFactory(validTestData, geneLocations, minColor, midColor, maxColor);
      assert.ok(true, "Numerical data doesn't throw test PASSED!");
    } catch (error) {
      assert.ok(false);
    }
    try {
      gene = "FOO";
      var testObj = new RegionColorFactory(invalidTestData2, geneLocations, minColor, midColor, maxColor);
      testObj.generateRegionColorArray(gene);
      assert.ok(false);
    } catch(error) {
      assert.ok(error === "ERROR: The data representing gene expression for each region must be"+
      " numerical!");
    }

    // Ensure that there is validation for the user defined min-mid-max colors.
    try {
      gene = "FOO";
      invalidColor1 = "bob";
      var testObj = new RegionColorFactory(validTestData, geneLocations, invalidColor1, midColor, maxColor);
      testObj.generateRegionColorArray(gene);
      assert.ok(false);
    } catch (error) {
      assert.ok(error === "ERROR: Invalid color [" + invalidColor1 + "]!");
    }

    // Ensure no errors are thrown when all conditions are met.
    try {
      gene = "FOO";
      var testObj = new RegionColorFactory(validTestData, geneLocations, minColor, midColor, maxColor);
      testObj.setColors("#ffffff", "#ff00ff", "#000000");
      testObj.generateRegionColorArray(gene);
      assert.ok(true, "GeneExpressionDataPassedInTest2");
    } catch (error) {
      assert.ok(false, "GeneExpressionDataPassedInTest2");
    }

    // Ensure that colors are generated appropriatly, for the min-mid-max normalization.
    validTestData2 = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 10, 10, 10, 10,
       10, 10, 10, 10, 10, 10, 10]
    ];
    var testObj = new RegionColorFactory(validTestData2, geneLocations, minColor, midColor, maxColor);
    gene = "FOO";
    testObj.setColors("#ff0000", "#00ff00", "#0000ff");
    var actual = testObj.generateRegionColorArray(gene);
    var expected1 = 0.99609375; // Decimal corresponding to ff. Whenever test data is equal to min mid or max,
    var expected2 = 0.96484375;
    for(i = 0; i < 10; i++) {  // there should be a coressisponding ff or 0.99609375 value.
      assert.ok(actual[i][0] == expected1);
    }
    for(i = 10; i < 20; i++) {
      assert.ok(actual[i][1] == expected2);
    }
    for(i = 20; i < 31; i++) {
      assert.ok(actual[i][2] == expected1);
    }

  });


 