QUnit.module("Normalize_Test_group");

QUnit.test("validate_zscore_normalization_test", function( assert ) {
    testData1 = [
        [2, 1, 0],
        [3, 3, 10],
        [4, 5, 20]
    ];

    expected1 = [
        [-1, -1, -1],
        [0, 0, 0],
        [1, 1, 1]
    ]
    
    var testObj = Normalizer();

    actual1 = testObj.normalizeColumnsByZScore();

    for(i = 0; i < expected1.length; i++) {
        for (j = 0; j < expected1[i].length; j++) {
            assert.ok(actual1[i][j] == expected1[i][j]);
        }
    }

});