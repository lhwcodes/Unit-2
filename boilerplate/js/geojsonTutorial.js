// Add all scripts to the JS folder
var map = L.map('map').setView([39.7554, -104.9939], 12);
//chosing basemap for web from leaflet
var Esri_NatGeoWorldMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC',
	maxZoom: 16
}).addTo(map);
//creating lines to be displayed on the map
var myLines = [{
        "type": "LineString",
        "coordinates": [[-100, 40], [-105, 45], [-110, 55]]
    }, {
        "type": "LineString",
        "coordinates": [[-105, 40], [-110, 45], [-115, 55]]
    }];L.geoJSON(myLines).addTo(map);
//creating a variable to store style for the lines
    var myStyle = {
        "color": "#ff7800",
        "weight": 5,
        "opacity": 0.65
    };
    //adding the style parameters to the lines before adding them to the map
    L.geoJSON(myLines, {
        style: myStyle
    }).addTo(map);
//creating an array of objects to be displayed on the map, with appropriate 
//properties and geometries for their purpose 
    var states = [{
        "type": "Feature",
        "properties": {"party": "Republican"},
        "geometry": {
            "type": "Polygon",
            "coordinates": [[
                [-104.05, 48.99],
                [-97.22,  48.98],
                [-96.58,  45.94],
                [-104.03, 45.94],
                [-104.05, 48.99]
            ]]
        }
    }, {
        "type": "Feature",
        "properties": {"party": "Democrat"},
        "geometry": {
            "type": "Polygon",
            "coordinates": [[
                [-109.05, 41.00],
                [-102.06, 40.99],
                [-102.03, 36.99],
                [-109.04, 36.99],
                [-109.05, 41.00]
            ]]
        }
    }];
    //checking the value of each features 'party' property, and asigning each feature 
    //their appropraite style parameters before adding them to the map 
    L.geoJSON(states, {
        style: function(feature) {
            switch (feature.properties.party) {
                case 'Republican': return {color: "#ff0000"};
                case 'Democrat':   return {color: "#0000ff"};
            }
        }
    }).addTo(map);
    //made this myself to test out the geojsonmarker options 
    var place = [{
            'type': "Feature",
            "properties": {
                "popupContent": "Lukas' Cirlce"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [-104.9700, 39.7468]
            }
        
    }];
//creating a variable to store marker parameters 
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
    L.geoJSON(place, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, geojsonMarkerOptions);
        }
    }).addTo(map);
//using onEachFeature method to check if each feature has properties, and 
//specifically, popupContent. If it does, it binds the popup to the 
//feature when it is clicked 
    function onEachFeature(feature, layer) {
        // does this feature have a property named popupContent?
        if (feature.properties && feature.properties.popupContent) {
            layer.bindPopup(feature.properties.popupContent);
        }
    }
    

    var someFeatures = [{
        "type": "Feature",
        "properties": {
            "name": "Coors Field",
            "show_on_map": true
        },
        "geometry": {
            "type": "Point",
            "coordinates": [-104.99404, 39.75621]
        }
    }, {
        "type": "Feature",
        "properties": {
            "name": "Busch Field",
            "show_on_map": false
        },
        "geometry": {
            "type": "Point",
            "coordinates": [-104.98404, 39.74621]
        }
    }];
    //the filter method is used here to cycle through the features of a specified list
    //and checks the show_on_map property if the feature should be represented
    L.geoJSON(someFeatures, {
        filter: function(feature, layer) {
            return feature.properties.show_on_map;
        }
    }).addTo(map);

    var geojsonFeature = {
        "type": "Feature",
        "properties": {
            "name": "Coors Field",
            "amenity": "Baseball Stadium",
            "popupContent": "This is where the Rockies play!"
        },
        "geometry": {
            "type": "Point",
            "coordinates": [-104.99404, 39.75621]
        }
    };
    
    L.geoJSON(geojsonFeature, {
        onEachFeature: onEachFeature
    }).addTo(map);

  