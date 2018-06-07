QUnit.module( "csv_file_loading_test_group" );
QUnit.test( "hello test", function( assert ) {
    assert.ok( 1 == "1", "Passed!" );
  });

  QUnit.test("validate_color_test", function( assert ) {
    assert.ok(validateColor("blue") == "1", "Passed!");
  });