

function mean(data) {
    var total = 0;
    for (var i = 0; i < data.length; i += 1) {
        total += data[i];
    }
    return total / data.length;
}

// Set up the module/controller for Uploading the Brain CSV file, and displaying the brain based off of the
// gene of interest.
angular.module('navigator', []).controller('NavigateController', ['$scope', function($scope) {
    
    // TODO: Functionality for uploading a csv file for the brain.
    $('#search-form').on('click', '#upload', function(e) { 
        
        d3.csv("./data/keys.csv", function(keystuff) { 
            
            d3.csv("./data/Allen_clean.csv", function(datas) {
                
                //attempt at making an input bar for genes
                // Load a new brain when the user clicks Go
                $('#search-form').on('click', '#search-button', function(e) {
                    e.preventDefault();
                    /*
                    //Intent of the below chunk is to clean data to allow for input into application
                    //"headerNames" and "name" are used to make header names the key for the object "name"

                    var headerNames = d3.keys(datas[0]);
                    var name = {
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

                    //Iterate through name and rearrange csv columns by value to map to key
                    var names_values = Object.values(name);
                    var names_keys = Object.keys(name);

                    for (var stuff = 0; stuff < 70; stuff ++) {
                        for (var items = 0; items < 62; items++) {
                            if (headerNames[stuff] === names_values[items]) {
                                headerNames[stuff] = names_keys[items];
                            }
                        }
                    }
                    //Data headers converted to keys
                    //TO DO:
                    //Remove unnecessary columns
                    //Build object with key = row number(index) and value = gene
                    */
                    //Build index/gene pair object


                    //Currently, values in 'keyObj' and indexes in 'datas' are identical
                    var gene = $('#search-field').val().trim().toUpperCase();
                    var loc = keystuff[0][gene];
                    var data = datas[loc];
                    //console.log(data);

                    //Need to pull values to calculate mid, min, max
                    var values = Object.values(data);
                    values = values.map(Number);

                    var mid = mean(values),
                        min = Math.min(...values);
                    var big = Math.max(...values);

                    //return scale of colors for min to mid to max values
                    var colors = d3.scale.linear()
                        .domain([min, mid, big])
                        .range(['#ffffff', '#ffd400', '#ff0000']);

                    //take color scale and return values mapped to object
                    //range will be replaced with list of values, key should be
                    //taken from column headers

                    //ISSUE Each val of j represented in values
                    //Each val of j + 1002 not represented in data
                    //Color scale works, but unfortunately since expressions are all so similar, colors are almost identical
                    var dict = [];
                    for (var j = 1002; j < 1036; j++) {
                        if (data[j]) {
                            dict[j] = [
                                d3.color(colors(parseFloat(data[j]))).r / 256,
                                d3.color(colors(parseFloat(data[j]))).g / 256,
                                d3.color(colors(parseFloat(data[j]))).b / 256
                            ];
                        }
                    }
                    //remove old brain to render new upon user click go
                    if ($scope.brain) {
                        $('#nav-brain').empty();
                    }

                    //render new brain
                    $scope.brain = new Brain({
                        divID: "nav-brain",  // div to render brain
                        callback: function (mesh) {
                            // callback when a mesh is selected/deselected
                            if (!mesh) {
                                // deselected: clear label & plot
                                $scope.selectedLabel = "";
                                $('#plot-canvas').empty();
                            } else {
                                // selected: add label, do plot.
                                $scope.selectedLabel = mesh.name;
                                do_boxplot("plot-canvas", mesh);
                            }
                            $scope.$apply();
                        },
                        manifest_url: 'data/lh_files_to_load.json',
                        label_mapper: "data/labels.json",
                        colors: dict
                    });
               
                });
            });
        });
    });
}]);

