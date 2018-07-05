QUnit.module("Region_Color_Factory_Test_group");

  QUnit.test("Gene Selection Tests", function(assert) {

    function tryThrow(testData, colorArray, header, gene, expectsThrow, expectedThrow) {
      try {
        var testObj = new RegionColorFactory(
          testData, header, colorArray[0], colorArray[1], colorArray[2]
        );
        testObj.generateRegionColorArray(gene);
        if(expectsThrow)
          assert.ok(false);
        else
          assert.ok(true);
      }
      catch(error) {
        if(expectsThrow)
          assert.ok(error === expectedThrow);
        else
          assert.ok(false, error);
      }
    }
<<<<<<< HEAD
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
=======

    var validTestData ={
      FOO: [1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3]
    };
>>>>>>> 47d8e3478e2aefbc58648365b04e031323eb3151

    var validTestData2 ={
      FOO: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 10, 10, 10, 10,
       10, 10, 10, 10, 10, 10, 10]
    };
    
<<<<<<< HEAD
    // Ensure that region specific data is numerical.
    try {
      var testObj = new RegionColorFactory();
      testObj.setDataToProcess(invalidTestData2);
      assert.ok(false);
    } catch(error) {
      assert.ok(error === "ERROR: The data represinting gene expression for each region must be"+
      " numerical!");
    }
=======
    var invalidTestData = {
      FOO: [1]
    };

    var validColorArray = ["#ff0000", "#00ff00", "#0000ff"];
    var invalidColorArray = ["#ff0000", "bob", "#0000ff"];
>>>>>>> 47d8e3478e2aefbc58648365b04e031323eb3151
    
    var invalidTestData2 = {
      FOO: [
        "foo", "dog", "apple", "cat", "dad","foo", "dog", "apple", "cat", "dad",
        "foo", "dog", "apple", "cat", "dad","foo", "dog", "apple", "cat", "dad",
        "foo", "dog", "apple", "cat", "dad","foo", "dog", "apple", "cat", "dad",
        "31"
      ]
    };

    var header = [
        "1002","1003","1005","1006","1007","1008","1009","1010",
        "1011","1012","1013","1014","1015","1016","1017","1018","1019",
        "1020","1021","1022","1023","1024","1025","1026","1027","1028",
        "1029","1030","1031","1034","1035"
    ] ;

    // Ensure only valid genes are options.
    tryThrow(validTestData, validColorArray, header, "SAY", 1, "ERROR: SAY is not a valid gene!");
    tryThrow(validTestData, validColorArray, header, "", 1, "ERROR: No gene was specified (Empty string)");
    
    // Ensure only numerical data represents the region data.
    tryThrow(invalidTestData2, validColorArray, header, "FOO", 1, "ERROR: The data representing gene expression for each region must be numerical!");
    
    // Ensure that only valid colors are run in the code.
    tryThrow(validTestData, invalidColorArray, header, "FOO", 1, "ERROR: Invalid color [bob]!");
   
    // Ensure that all systems work together with valid data.
    tryThrow(validTestData, validColorArray, header, "FOO", 0, "");

    var minColor = "#ff0000";
    var midColor = "#00ff00";
    var maxColor = "#0000ff";


    // Ensure that colors are generated appropriatly, for no normalization option.
    var testObj = new RegionColorFactory(validTestData2, header, minColor, midColor, maxColor);
    gene = "FOO";
    testObj.setColors("#ff0000", "#00ff00", "#0000ff");
    var actual = testObj.generateRegionColorArray(gene);
    var expected1 = 0.99609375; // Decimal corresponding to ff. Whenever test data is equal to min mid or max,
    var expected2 = 0.96484375;
    for(i = 1002; i < 1013; i++) {  // there should be a coressisponding ff or 0.99609375 value.
      if(i == 1004)
        continue;
      assert.ok(actual[i][0] == expected1);
    }
    for(i = 1013; i < 1023; i++) {
      assert.ok(actual[i][1] == expected2);
    }
    for(i = 1023; i < 1036; i++) {
      if(i == 1032 || i == 1033)
        continue;
      assert.ok(actual[i][2] == expected1);
    }

    // Ensure that colors are generated appropriatly, for the zscore normalization.
    var testObj = new RegionColorFactory(validTestData2, header, minColor, midColor, maxColor);
    gene = "FOO";
    testObj.setNormalizationState("zScoreRow");
    testObj.setColors("#ff0000", "#00ff00", "#0000ff");
    var actual = testObj.generateRegionColorArray(gene);
    var expected1 = 0.99609375; // Decimal corresponding to ff. Whenever test data is equal to min mid or max,
    var expected2 = 0.96484375;

    for(i = 1002; i < 1013; i++) {  // there should be a coressisponding ff or 0.99609375 value.
      if(i == 1004)
        continue;
      assert.ok(actual[i][0] == expected1);
    }
    for(i = 1013; i < 1023; i++) {
      assert.ok(actual[i][1] == expected2);
    }
    for(i = 1023; i < 1036; i++) {
      if(i == 1032 || i == 1033)
        continue;
      assert.ok(actual[i][2] == expected1);
    }
  });


 