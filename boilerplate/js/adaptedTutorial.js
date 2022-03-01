/* Map of GeoJSON data from MegaCities.geojson */
//declare map var in global scope
var map;
//function to instantiate the Leaflet map
function createMap(){
    //create the map
    map = L.map('map', {
        center: [20, 0],
        zoom: 2
    });

    //add OSM base tilelayer
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
    }).addTo(map);

    //call getData function
    getData()
}
//added at Example 2.3 line 20...function to attach popups to each mapped feature
function onEachFeature(feature, layer) {
    //no property named popupContent; instead, create html string with all properties
    var popupContent = "";
    if (feature.properties) {
        //loop to add feature property names and values to html string
        for (var property in feature.properties){
            popupContent += "<p>" + property + ": " + feature.properties[property] + "</p>";
        }
        layer.bindPopup(popupContent);
    };

};

//function to retrieve the data and place it on the map
function getData(){
    //load the data
    fetch("data/MegaCities.geojson")
        .then(function(response){
            return response.json();
        })
        // .then(function(json){
        //     //create a Leaflet GeoJSON layer and add it to the map
        //     L.geoJson(json, {
        //         onEachFeature: onEachFeature
        //     }).addTo(map);
        // }) 
        .then(function(json) {
                //create marker options
                var geojsonMarkerOptions = {
                    radius: 8,
                    fillColor: "#ff7800",
                    color: "#000",
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                };
                //using the pointToLayer method to turn any group of point features into
                //their own layer onn the map, using parameters from the markeroptions var
                L.geoJSON(json, {
                    pointToLayer: function (feature, latlng) {
                        return L.circleMarker(latlng, geojsonMarkerOptions);
                    },
                    onEachFeature: onEachFeature
                }).addTo(map);
             })
       
};

document.addEventListener('DOMContentLoaded',createMap)


//creating a variable to store style for the lines
    // var myStyle = {
    //     "color": "#ff7800",
    //     "weight": 5,
    //     "opacity": 0.65
    // };
    //adding the style parameters to the lines before adding them to the map
    // L.geoJSON(, {
    //     style: myStyle
    // }).addTo(map);
 
//creating a variable to store marker parameters 
  
//using onEachFeature method to check if each feature has properties, and 
//specifically, popupContent. If it does, it binds the popup to the 
//feature when it is clicked 

    
   
    //the filter method is used here to cycle through the features of a specified list
    //and checks the show_on_map property if the feature should be represented
    // L.geoJSON(someFeatures, {
    //     filter: function(feature, layer) {
    //         return feature.properties.show_on_map;
    //     }
    // }).addTo(map);

  
  
