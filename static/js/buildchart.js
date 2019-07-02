var x_axis=[2012,2013,2014,2015,2016,2017]

function buildGDPCharts(country) {
   d3.json(`/metadata/${country}`).then(function(d, i){
    Plotly.purge('myDiv')
    	console.log(d)
    	console.log(i)
    	console.log(d[i])
    y_val=[];
    y_val2=[]
    for(var h=2; h<8;h++){
    y_val.push(d[`GDP_201${h}`])
    y_val2.push(d[`QII_201${h}`])
    }

    console.log(y_val)

    var trace={
    	x:x_axis,
    	y:y_val,
    	mode: 'lines+markers',
 		type: 'scatter',
 		name: 'GDP per Capita',

        };

    var trace2 = {
		  x: x_axis,
		  y: y_val2,
		  xaxis: 'x2',
		  yaxis: 'y2',
		 mode: 'lines+markers',
 		type: 'scatter',
 		name:`QLI`,
		};


    var layout = {
    	showlegend: false,
 		 title: `${country}`,
 		 xaxis:{
 		 	title:"Year",
 		 	domain:[0,0.46]
 		 },
 		 yaxis:{
 		 	title:"GDP per Capita",
 		 },

 		xaxis2: {domain: [0.54, 1],
 			title:"Year",
 		},
  		yaxis2: {anchor: 'x2',
  		title:"Quality of Life Index"
				}
}

    var data=[trace,trace2]
    Plotly.newPlot('myDiv', data,layout);
})}


function init(){
	var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((countryNames) => {
    countryNames.forEach((country) => {
      selector
        .append("option")
        .text(country)
        .property("value", country);
    });
    const firstCountry=countryNames[0]
	buildGDPCharts(firstCountry)
})}

function optionChanged(newCountry) {
	buildGDPCharts(newCountry)};
init();



