/**
 * @author Matthew Brown
 * @description Functions for processing a csv file.
 */

/**
 * @function Description: Returns the location of a gene. Also validates if a Gene is valid, if not, throws an error.
 * @param {*} locationDict Associative array containing the genes as keys and locations as values.
 * @param {*String} gene containing the gene name.
 */
function getGeneLocation(locationDict, gene) {
    var location = locationDict[gene];
    try {
        if(gene == "") {
            throw "ERROR: No gene was specified (Empty string)";
        }
        else if(location == null) {
            throw "ERROR: " + gene +" is not a valid entry";
        }
        else {
            return location;
        }
    }
    catch (errorMsg) {
        throw errorMsg;
    }
}
 
/**
 * Returns an associative array or "dictionary" containing the location  of every gene in the csv file.
 * @param {*} csv_object CSV object to be processed. 
 */
 function getGeneLocDict(csv_object) {
    var dictionary = {};
    length = csv_object.length;
    
    // Start at index 2
    for(i = 2; i < length; i++) {
        
        // Weirdly enough, empty string is the gene location?
        key = csv_object[i][""];
        if(key != "") {
            dictionary[key] = i;
        }
    }

    return dictionary;
 }

 /**
  * Returns Gene Region Data in an associative array.
  * @param {Float} location location of the Gene in the csv file.
  * @param {*} csv_object CSV file object to be processed.
  */
 function getRegionDict(location, csv_object){

    // Our csv object looks like this in a row.
    // "ctx-lh-caudalanteriorcingulate" : 9.4231
    // We want it to look like this:
    // 1002 : 9.4231
    // This is what this function does.

    headerObj = generateHeaderObject();

    // Set gene Data equal to the row containing the gene we are looking at.
    geneData = csv_object[location];

    // Our return object. It will contain an associative array with a key value pair that will look something like 1002: 9.323244,
    // Where the key is the Region ID and the value is the Gene Expression Data.
    regionDictionary = {};

    for(i = 0; i < 34; i++) {
        
        // For reason unknown to me we don't have regions for IDS 1004, 1032, and 1033, so we skip them.
        switch(i) {
            case 2:
            case 30:
            case 31:
                continue;
            default:

                // Keys for each brain region (I:E 1002 is ctx-lh-caudalanteriorcingulate)
                key1 = headerObj[i + 1002]; 
                key2 = headerObj[i + 2002];

                // Extract the data.
                data1 = parseFloat(geneData[key1]);
                data2 = parseFloat(geneData[key2]);

                // Set it to our return object.
                regionDictionary[i + 1002] = data1;
                regionDictionary[i + 2002] = data2;
                break;
        }

    }
    return regionDictionary;
 }

 /**
  * @function applyZScore Normalizes the array using a z-score.
  * @param {Float Array} geneRegionData An array of floats containing gene expression data, for the regions of the brain.
  */
 function applyZScore(geneRegionData) {
    geneRegionData = arr.zScores(geneRegionData);
    return geneRegionData;
 }

 /** 
  * Generates an associative array with a Key for each region,
  * usefull for processing the brain gene expression data.
 */
 function generateHeaderObject() {
    return {
        "1002": "ctx-lh-caudalanteriorcingulate",
        "1003": "ctx-lh-caudalmiddlefrontal",
        "1005": "ctx-lh-cuneus",
        "1006": "ctx-lh-entorhinal",
        "1007": "ctx-lh-fusiform",
        "1008": "ctx-lh-inferiorparietal",
        "1009": "ctx-lh-inferiortemporal",
        "1010": "ctx-lh-isthmuscingulate",
        "1011": "ctx-lh-lateraloccipital",
        "1012": "ctx-lh-lateralorbitofrontal",
        "1013": "ctx-lh-lingual",
        "1014": "ctx-lh-medialorbitofrontal",
        "1015": "ctx-lh-middletemporal",
        "1016": "ctx-lh-parahippocampal",
        "1017": "ctx-lh-paracentral",
        "1018": "ctx-lh-parsopercularis",
        "1019": "ctx-lh-parsorbitalis",
        "1020": "ctx-lh-parstriangularis",
        "1021": "ctx-lh-pericalcarine",
        "1022": "ctx-lh-postcentral",
        "1023": "ctx-lh-posteriorcingulate",
        "1024": "ctx-lh-precentral",
        "1025": "ctx-lh-precuneus",
        "1026": "ctx-lh-rostralanteriorcingulate",
        "1027": "ctx-lh-rostralmiddlefrontal",
        "1028": "ctx-lh-superiorfrontal",
        "1029": "ctx-lh-superiorparietal",
        "1030": "ctx-lh-superiortemporal",
        "1031": "ctx-lh-supramarginal",
        "1034": "ctx-lh-transversetemporal",
        "1035": "ctx-lh-insula",
        "2002": "ctx-rh-caudalanteriorcingulate",
        "2003": "ctx-rh-caudalmiddlefrontal",
        "2005": "ctx-rh-cuneus",
        "2006": "ctx-rh-entorhinal",
        "2007": "ctx-rh-fusiform",
        "2008": "ctx-rh-inferiorparietal",
        "2009": "ctx-rh-inferiortemporal",
        "2010": "ctx-rh-isthmuscingulate",
        "2011": "ctx-rh-lateraloccipital",
        "2012": "ctx-rh-lateralorbitofrontal",
        "2013": "ctx-rh-lingual",
        "2014": "ctx-rh-medialorbitofrontal",
        "2015": "ctx-rh-middletemporal",
        "2016": "ctx-rh-parahippocampal",
        "2017": "ctx-rh-paracentral",
        "2018": "ctx-rh-parsopercularis",
        "2019": "ctx-rh-parsorbitalis",
        "2020": "ctx-rh-parstriangularis",
        "2021": "ctx-rh-pericalcarine",
        "2022": "ctx-rh-postcentral",
        "2023": "ctx-rh-posteriorcingulate",
        "2024": "ctx-rh-precentral",
        "2025": "ctx-rh-precuneus",
        "2026": "ctx-rh-rostralanteriorcingulate",
        "2027": "ctx-rh-rostralmiddlefrontal",
        "2028": "ctx-rh-superiorfrontal",
        "2029": "ctx-rh-superiorparietal",
        "2030": "ctx-rh-superiortemporal",
        "2031": "ctx-rh-supramarginal",
        "2034": "ctx-rh-transversetemporal",
        "2035": "ctx-rh-insula"
    };
 }