QUnit.module( "csv_file_processing_test_group" );

// Unit tests for asserting that we can find the location of a gene in our gene location dictionary
// and invalid entries are handled correctly.
QUnit.test("get_gene_location_test", function( assert ) {

    testObj = [];
    testObj["fake_gene_1"] = "2";
    testObj["fake_gene_2"] = "4";
    testObj["fake_gene_3"] = "6";

    nullGene = "null_gene";
    testObj[nullGene] = null;

    assert.ok(getGeneLocation(testObj, "fake_gene_1") == "2", "Passed!");
    assert.ok(getGeneLocation(testObj, "fake_gene_2") == "4", "Passed!");
    assert.ok(getGeneLocation(testObj, "fake_gene_3") == "6", "Passed!");
    assert.ok(getGeneLocation(testObj, "fake_gene_1") != 1, "Passed!");

    try {
        getGeneLocation(testObj, "");
    } catch(err) {
        assert.ok( err == "ERROR: No gene was specified (Empty string)", "Passed!");
    }

    try {
        getGeneLocation(testObj, "null_gene");
    } catch(err) {
        assert.ok( err == "ERROR: " + nullGene +" is not a valid entry", "Passed!");
    }
    
  });