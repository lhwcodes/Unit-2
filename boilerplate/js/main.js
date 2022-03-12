var map;
var dataStats = {};

function PopupContent(properties, attribute){
    this.properties = properties;
    this.attribute = attribute;
    this.year = this.attribute;
    this.sales = this.properties[attribute];
    this.formatted = "<p><b>State:</b> " + this.properties.State + "<p><b>Gross Sales of Hunting and Fishing Lisences in " + this.attribute + ":</b> " + this.sales + " million</p>";
};


//function to instantiate the Leaflet map
function createMap(){
    //create the map
    map = L.map('map', {
        center: [40, -100],
        zoom: 3.5,
        maxZoom: 6.5,
        minZoom: 2.5
    });

    //add OSM base tilelayer
    L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain-background/{z}/{x}/{y}{r}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	subdomains: 'abcd',
	minZoom: 0,
	maxZoom: 18,
	ext: 'png'
}).addTo(map);

    //call getData function
    getData()
};
function calcStats(data){
    //create empty array to store all data values
    var allValues = [];
    //loop through each city
    for(var state of data.features){
        //loop through each year
        for(var year = 2009; year <= 2021; year+=2){
              //get value for current year
              var value = Number(state.properties[String(year)]);
              //add value to array
              allValues.push(value);
        }
    }
    //get min, max, mean stats for our array
    dataStats.min = Math.min(...allValues);
    dataStats.max = Math.max(...allValues);
    //calculate meanValue
    var sum = allValues.reduce(function(a, b){return a+b;});
    dataStats.mean = sum/ allValues.length;
    

    return dataStats;
};

//calculate the radius of each proportional symbol
function calcPropRadius(attValue) {
    //constant factor adjusts symbol sizes evenly
    var minRadius = 5;
    //Flannery Apperance Compensation formula
    var radius = 1.0083 * Math.pow(attValue/dataStats.min,0.5715) * minRadius

    return radius;
};
//Step 3: Add circle markers for point features to the map
//function to convert markers to circle markers
function pointToLayer(feature, latlng, attributes){
    //Determine which attribute to visualize with proportional symbols
    var attribute = attributes[0];

    //create marker options
    var options = {
        fillColor: "#BC8F8F",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };

    //For each feature, determine its value for the selected attribute
    var attValue = Number(feature.properties[attribute]);

    //Give each feature's circle marker a radius based on its attribute value
    options.radius = calcPropRadius(attValue);

    //create circle marker layer
    var layer = L.circleMarker(latlng, options);

    var popup = new PopupContent(feature.properties, attribute);
    
    //bind the popup to the circle marker
    layer.bindPopup(popup.formatted,{
        offset: new L.point(0,-options.radius)
    });
    
    //return the circle marker to the L.geoJson pointToLayer option
    return layer;
    
};

//Add circle markers for point features to the map
function createPropSymbols(data, attributes){
    //create a Leaflet GeoJSON layer and add it to the map
    L.geoJson(data, {
        pointToLayer: function(feature, latlng){
            return pointToLayer(feature, latlng, attributes);
        }

    }).addTo(map);
};

//Step 3: build an attributes array from the data
function processData(data){
    //empty array to hold attributes
    var attributes = [];

    //properties of the first feature in the dataset
    var properties = data.features[0].properties;

    //push each attribute name into attributes array
    for (var attribute in properties){
        //only take attributes with population values
        if (attribute.indexOf("20") > -1){
            attributes.push(attribute);
         
        };
    };
    //return attributes to be used by later functions
    return attributes;
};

//Step 1: Create new sequence controls

    //Create new sequence controls
function createSequenceControls(attributes){   
    var SequenceControl = L.Control.extend({
        options: {
            position: 'bottomleft'
        },

        onAdd: function () {
            // create the control container div with a particular class name
            var container = L.DomUtil.create('div', 'sequence-control-container');

             //create range input element (slider)
             container.insertAdjacentHTML('beforeend', '<input class="range-slider" type="range">')
             //add step buttons
             container.insertAdjacentHTML('afterbegin','<button class="step" id="reverse"></button>');
             container.insertAdjacentHTML('beforeend','<button class="step" id="forward"></button>');

             //disable any mouse event listeners for the container
            L.DomEvent.disableClickPropagation(container);

            // ... initialize other DOM elements

            return container;
        }
    });

    map.addControl(new SequenceControl());    // add listeners after adding control}
    //create range input element (slider)
    document.querySelector('.range-slider').max = 6;
    document.querySelector('.range-slider').min = 0;
    document.querySelector('.range-slider').value = 0;
    document.querySelector('.range-slider').step = 1;

    //below Example 3.6...add step buttons
    document.querySelector('#reverse').insertAdjacentHTML('beforeend','<img src="img/reverse.png">');
    document.querySelector('#forward').insertAdjacentHTML('beforeend','<img src="img/forward.png">');

     //Step 5: click listener for buttons
     document.querySelectorAll('.step').forEach(function(step){
        step.addEventListener("click", function(){
            var index = document.querySelector('.range-slider').value;
            
            //Step 6: increment or decrement depending on button clicked
            if (step.id == 'forward'){
                index++;
                //Step 7: if past the last attribute, wrap around to first attribute
                index = index > 6 ? 0 : index;
            } else if (step.id == 'reverse'){
                index--;
                //Step 7: if past the first attribute, wrap around to last attribute
                index = index < 0 ? 6 : index;
            };

            //Step 8: update slider
            document.querySelector('.range-slider').value = index;

            updatePropSymbols(attributes[index]);
            
        })
    })
    //Step 5: input listener for slider
    document.querySelector('.range-slider').addEventListener('input', function(){            
        var index = this.value;
        updatePropSymbols(attributes[index]);
        
    });
};
//Step 10: Resize proportional symbols according to new attribute values
function updatePropSymbols(attribute){
    map.eachLayer(function(layer){
        if (layer.feature && layer.feature.properties[attribute]){
            //update the layer style and popup
            //access feature properties
            var props = layer.feature.properties;

            //update each feature's radius based on new attribute values
            var radius = calcPropRadius(props[attribute]);
            layer.setRadius(radius);

            var popupContent = new PopupContent(props, attribute);

            //update popup content            
            popup = layer.getPopup();            
            popup.setContent(popupContent.formatted).update();

        };
        
    });
    //update legend using new function
    updateLegend(attribute)
};

function getCircleValues(attribute) {
    //make min highest possible nad max lowest possible to allow for value to be stored in the correct object variable 
    var min = Infinity;
    var max = -Infinity;
    //need to access each layer of the legend control container 
    map.eachLayer(function (layer) {
        //checking if layer has features so we can access its properties 
        if (layer.feature) {
            //putting value of the attribute in variable to use later
            var attributeValue = Number(layer.feature.properties[attribute]);
            //testing for maximum
            if (attributeValue > max){
                max = attributeValue;
            }
            //testing for minimum 
            if (attributeValue < min){
                min = attributeValue;
            }
        };
    })
        //setting mean
        var mean = (max + min) / 2;
         //returning values as an iterable object for later use 
        return {
            max: max,
            mean: mean,
            min: min,
    };

};

function updateLegend(attribute){
    //getting value of year from current attribute 
    var year = attribute;
    //replace content in legend with the correct years data
    document.querySelector('span.year').innerHTML = year;
    //get the min max and mean values, will be returned as an object
    var CircleValues = getCircleValues(attribute);
    //iterating through Circlevalues using for loop
    for (var circ in CircleValues) {
        //first store radius as variable  
        var radius = calcPropRadius(CircleValues[circ]);
        //set CY and R attributes for each circ
        document.querySelector('#'+ circ).setAttribute('cy', 59-radius);
        document.querySelector('#'+ circ).setAttribute('r', radius);
        //set the text of each circle in the legend 
        document.querySelector('#'+ circ + '-text').textContent = Math.round(CircleValues[circ]*100)/100 + ' million';
    } 
};

//Step 2: Import GeoJSON data
function getData(){
    //load the data
    fetch("data/CorrectLisenceSales.geojson")
        .then(function(response){
            var response = response;
            return response.json();
            
        })
        .then(function(json){
            var attributes = processData(json);
             //calling our renamed function  
            calcStats(json);
            //call function to create proportional symbols
            createPropSymbols(json, attributes);
            createSequenceControls(attributes);
            createLegend(attributes)
        })
};

function createLegend(){
    var LegendControl = L.Control.extend({
        options: {
            position: 'bottomright'
        },

        onAdd: function () {
            // create the control container with a particular class name
            var container = L.DomUtil.create('div', 'legend-control-container');
            //Setting initial legend text with html
            container.innerHTML = '<p class="temporalLegend">Total Sales of Hunting and Fishing Lisences in: <span class="year">2009</span></p>';

            //Step 1: start attribute legend svg string
            var svg = '<svg id="attribute-legend" width="160px" height="60px">';
              //array of circle names to base loop on
            var circles = ["max", "mean", "min"];

            //Step 2: loop to add each circle and text to svg string
            //Example 3.8 line 4...loop to add each circle and text to SVG string
        for (var i=0; i<circles.length; i++){

            //Step 3: assign the r and cy attributes            
            var radius = calcPropRadius(dataStats[circles[i]]);           
            var cy = 59 - radius;            

            //circle string            
            svg += '<circle class="legend-circle" id="' + circles[i] + '" r="' + radius + '"cy="' + cy + '" fill="#BC8F8F" fill-opacity="0.8" stroke="#000000" cx="30"/>';

            //evenly space out labels            
            var textY = i * 20 + 20;            

            //text string            
            svg += '<text id="' + circles[i] + '-text" x="65" y="' + textY + '">' + Math.round(dataStats[circles[i]]*100)/100 + " million" + '</text>';
        };

        //close svg string
        svg += "</svg>";

            //add attribute legend svg to container
            container.insertAdjacentHTML('beforeend', svg);

            return container;
        }
    });

    map.addControl(new LegendControl());

};

document.addEventListener('DOMContentLoaded',createMap)
