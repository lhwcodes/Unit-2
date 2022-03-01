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
    fetch("data/MyPoints.geojson")
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

