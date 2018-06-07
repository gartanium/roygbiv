function generateExpectedData() {
    var colorArray = [];

    for(i = 0; i < 16,777,216; i++) {
        colorArray[i] = "#" + i.toString(16);
    }
    return colorArray;
}   

var colorArray = generateExpectedData();

for(i = 0; i < colorArray.length; i++) {
    assertTrue(validateColor(colorArray[i]), validateColorTest);
}

