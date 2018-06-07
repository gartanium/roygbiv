function testPassedMessage(testName) {
    print("Test: " + testName + " passed!");
}

function testFailedMessage(expected, actual, testName) {
    print("Test: " + testName + " failed!");
    print("\tExpected: " + expected);
    print("\tActual: " + actual);

}

function assertEqual(expected, actual, testName) {
    if(expected === actual){
        testPassedMessage(testName);
    }
    else
    {
        testFailedMessage(expected, actual, testName);
    }
}

function assertTrue(statement, testName) {
    if(statement){
        testPassedMessage(testName);
    }
    else
    {
        testFailedMessage(1, 0, testName);
    }
}