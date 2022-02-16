//initialize function called when the script loads
function initialize(){
  cities();
};

//function to create a table with cities and their populations
function cities(){
  //define two arrays for cities and population
  var cityPop = [
  { 
      city: 'Madison',
      population: 233209
  },
  {
      city: 'Milwaukee',
      population: 594833
  },
  {
      city: 'Green Bay',
      population: 104057
  },
  {
      city: 'Superior',
      population: 27244
  }
  ]
  //create the table element
  var table = document.createElement("table");

  //create a header row
  var headerRow = document.createElement("tr");

  //add the "City" and "Population" columns to the header row
  headerRow.insertAdjacentHTML("beforeend","<th>City</th><th>Population</th>")

  //add the row to the table
  table.appendChild(headerRow);
      //Example 4.2 line 37...
    //console.log(cities);
    //loop to add a new row for each city
    for (var i = 0; i < cityPop.length; i++){
      console.log("Hello World");
      //assign longer html strings to a variable
      var rowHtml = "<tr><td>" + cityPop[i].city + "</td><td>" + cityPop[i].population + "</td></tr>";
      //add the row's html string to the table
      table.insertAdjacentHTML('beforeend',rowHtml);
  };
  document.querySelector("#myDiv").appendChild(table);
}
function addColumns(cityPop){
  console.log('poo')
  document.querySelectorAll("tr").forEach(function(row, i){

    if (i == 0){

      row.insertAdjacntHTML('beforeend', '<th>City Size</th>');
    } else {

      var citySize;

      if (cityPop[i-1].population < 100000){
        citySize = 'Small';

      } else if (cityPop[i-1].population < 500000){
        citysize = 'Medium';

      } else {
        citySize = 'Large';
      };

    row.insertAdjacntHTML = '<td' + citySize + '</td>';}
    ;
  });
};

function addEvents(){
console.log('poo')
document.querySelector("table").addEventListener("mouseover", function(){
  
  var color = "rgb"; 

  for (var i=0; i<3; i++){

    var random = Math.round(Math.random() * 255);

    color += "random";

    if (i<2){
      color += ",";
    
    } else {
      color += ")";
      //missing curly bracket added to else
    }
    
  };

  document.querySelector("table").color = color;
});

function clickme(){

  alert('Hey, you clicked me!');
};

document.querySelector("table").addEventListener("click", clickme)
};

//call the initialize function when the DOM has loaded
document.addEventListener('DOMContentLoaded',initialize)