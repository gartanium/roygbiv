QUnit.module("Region_Color_Factory_Test_group");

  QUnit.test("Gene Selection Tests", function(assert) {

    function tryThrow(testData, geneLocation, colorArray, gene, expectsThrow, expectedThrow) {
      try {
        var testObj = new RegionColorFactory(
          testData, geneLocation, colorArray[0], colorArray[1], colorArray[2]
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

    var validTestData = [
      [1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3]
    ];

    var validTestData2 = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 10, 10, 10, 10,
       10, 10, 10, 10, 10, 10, 10]
    ];
    
    var invalidTestData = [
      [1]
    ];

    var validColorArray = ["#ff0000", "#00ff00", "#0000ff"];
    var invalidColorArray = ["#ff0000", "bob", "#0000ff"];
    
    var invalidTestData2 = [
      [
        "foo", "dog", "apple", "cat", "dad","foo", "dog", "apple", "cat", "dad",
        "foo", "dog", "apple", "cat", "dad","foo", "dog", "apple", "cat", "dad",
        "foo", "dog", "apple", "cat", "dad","foo", "dog", "apple", "cat", "dad",
        "31"
      ]
    ]
      
    var geneLocations = {
      FOO: 0,
      BOB: 1,
      FOX: 2
    };

    // Ensure only valid genes are options.
    tryThrow(validTestData, geneLocations, validColorArray, "SAY", 1, "ERROR: SAY is not a valid gene!");
    tryThrow(validTestData, geneLocations, validColorArray, "", 1, "ERROR: No gene was specified (Empty string)");
    
    // Ensure only numerical data represents the region data.
    tryThrow(invalidTestData2, geneLocations, validColorArray, "FOO", 1, "ERROR: The data representing gene expression for each region must be numerical!");
    
    // Ensure that only valid colors are run in the code.
    tryThrow(validTestData, geneLocations, invalidColorArray, "FOO", 1, "ERROR: Invalid color [bob]!");
   
    // Ensure that all systems work together with valid data.
    tryThrow(validTestData, geneLocations, validColorArray, "FOO", 0, "");

    var minColor = "#ff0000";
    var midColor = "#00ff00";
    var maxColor = "#0000ff";


    // Ensure that colors are generated appropriatly, for no normalization option.
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

    // Ensure that colors are generated appropriatly, for the zscore normalization.
    validTestData2 = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 10, 10, 10, 10,
       10, 10, 10, 10, 10, 10, 10]
    ];
    var testObj = new RegionColorFactory(validTestData2, geneLocations, minColor, midColor, maxColor);
    gene = "FOO";
    testObj.setNormalizationState("zScoreRow");
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


 