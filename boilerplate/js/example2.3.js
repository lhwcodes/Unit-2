//initialize function called when the script loads
function initialize(){
    //define two arrays for cities and population
    var cityPop = [
        { 
            //adding Madison and its data 
            city: 'Madison',
            population: 233209
        },
        {
            //adding Milwaukee and its data
            city: 'Milwaukee',
            population: 594833
        },
        {
            //adding Green Bay and its data
            city: 'Green Bay',
            population: 104057
        },
        {
            //adding Superior and its data
            city: 'Superior',
            population: 27244
        }
    ]
    //call cities function on cityPop
    cities(cityPop);
    //call addColumns fucntion on cityPop
    addColumns(cityPop);
    //call addEvents
    addEvents();
};

//function to create a table with cities and their populations
function cities(cityPop) {

    //create the table element
    var table = document.createElement("table");
        
    //create a header row
    var headerRow = document.createElement("tr");

    //add the "City" and "Population" columns to the header row
    headerRow.insertAdjacentHTML("beforeend","<th>City</th><th>Population</th>")
  
    //add the row to the table
    table.appendChild(headerRow);
    for(var i = 0; i < cityPop.length; i++) {
        //assign longer html strings to a variable
        var rowHtml = "<tr><td>" + cityPop[i].city + "</td><td>" + cityPop[i].population + "</td></tr>";
        //add the row's html string to the table
        table.insertAdjacentHTML('beforeend',rowHtml);
    }
    //appending the table to our element mydiv
    document.querySelector("#myDiv").appendChild(table);
};
//creating function addColumns
function addColumns(cityPop){
    //adding a row for each new value in cityPop
    document.querySelectorAll("tr").forEach(function(row, i){

        if (i == 0){
            //add extra title to the header City Size
            row.insertAdjacentHTML('beforeend', '<th>City Size</th>');
        } else {
            //creating variable size 
            var citySize;
            /*checking value of cityPop[population] at i-1(for correct sequencing)
            to see if it is less than 100000, if it is then its citySize value
            will be assigned to small*/
            if (cityPop[i-1].population < 100000){
                citySize = 'Small';
                /*checking if value at cityPop is less than 500000, if it is 
                its citySize value will be assigned to medium*/ 
            } else if (cityPop[i-1].population < 500000){
                citySize = 'Medium';
                //assigning any other city in cityPop to Large in citySize
            } else {
                citySize = 'Large';
            };
            //adding each value to its assigned row 
            row.insertAdjacentHTML('beforeend' ,'<td>' + citySize + '</td>');}
        ;
    });
};
    //create addEvents function 
function addEvents(){
    //adding mouseover interaction to table element 
    document.querySelector("table").addEventListener("mouseover", function(){
        //creating variable to store random color value 
        var color = "rgb(";
        //creating loop to generate a random rgb value color
        for (var i=0; i<3; i++){
            //creating variable to store random number 0-255
            var random = Math.round(Math.random() * 255);
            //assinging the random value to color variable
            color += random;
            /*checking if i is less than 2, to decide how to continue, 
            if less than two, a comma is needed for the next value*/
            if (i<2){
                color += ",";
            /*if i is greater than 2 then after this iteration a ) is 
            required to complete the syntax for entering a rgb value*/
            } else {
                color += ")";
                //missing curly bracket added to else
            }
            
        };
        //getting table element, setting its color to the randomly generated color
        document.querySelector("table").style.color = color;
    });
// create function clickMe
    function clickMe(){
        //alert from clicking interaction
        alert('Hey, you clicked me!');
    };
    //selecting table element and adding the click interaction 
    document.querySelector("table").addEventListener("click", clickMe)
};

    


//initializing the code
document.addEventListener('DOMContentLoaded',initialize)