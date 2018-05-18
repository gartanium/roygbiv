/**
 * @author Matthew Brown
 * @description Functions for processing a csv file.
 */

 function getGeneLocDict(csv_object) {
    var dictionary = {};
    length = csv_object.length;
    
    for(i = 2; i < length; i++) {
        
        key = csv_object[i][""];
        if(key != "") {
            dictionary[key] = i;
        }
    }

    return dictionary;
 }

 function getRegionDict(location, csv_object){
    headerObj = generateHeaderObject();
    geneData = csv_object[location];
    regionDictionary = {};

    for(i = 0; i < 34; i++) {
        
        switch(i) {
            case 2:
            case 30:
            case 31:
                continue;
            default:

                // Keys for each brain region (I:E 1002 is ctx-lh-caudalanteriorcingulate)
                key1 = headerObj[i + 1002]; 
                key2 = headerObj[i + 2002];

                // Get the data from the specific brain region. 
                data1 = geneData[key1];
                data2 = geneData[key2];

                // Set it to our return object.
                regionDictionary[i + 1002] = data1;
                regionDictionary[i + 2002] = data2;
                break;
        }

    }

    return regionDictionary;
 }

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