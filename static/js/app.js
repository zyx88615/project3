
function createChorpleth(year){
    
    // Adding tile layer

    var b=L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 10,
      id: "mapbox.light",
      accessToken: API_KEY
    })
    
    var c=L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 10,
      id: "mapbox.streets-satellite",
      accessToken: API_KEY
    })
    
    // Link to GeoJSON
    var APILink = "/data8481115";
    
    // "http://data.beta.nyc//dataset/d6ffa9a4-c598-4b18-8caf-14abde6a5755/resource/74cdcc33-512f-439c-" +
    // "a43e-c09588c4b391/download/60dbe69bcd3640d5bedde86d69ba7666geojsonmedianhouseholdincomecensustract.geojson";
    
    var geojson;
    // Grab data with d3
    d3.json(APILink, function(error, data) {
    //   console.log(kk)


    //  allbikelocation=[]
    //   for (var i=0; i<data.features.length; i++){
    //     var station = data.features[i]
    //     var bikelocation= L.geoJson(station)
    
    //     allbikelocation.push(bikelocation)}
    
    //     console.log(allbikelocation)

      if (error) throw error;
      // Create a new choropleth layer
      geojson = L.choropleth(data, {
        // Define what  property in the features to use
        valueProperty: `QII_${year}`,

        // Set color scale
        scale: ["red","yellow","green"],
    
        // Number of breaks in step range
        steps:15,
    
        // q for quartile, e for equidistant, k for k-means
        mode: "q",
        style: {
          // Border color
          color: "#fff",
          weight: 1,
          fillOpacity: 0.8
        },
        // Binding a pop-up to each layer
        onEachFeature: function(feature, layer) {
          layer.bindPopup(feature.properties["Country"] + `<hr>${year} Quality of Life Index: ` +
          feature.properties[`QII_${year}`]);
             layer.on({
              mouseover: highlightFeature,
              mouseout: resetHighlight,
          });
        }
      
        
      });
      geojson2 = L.choropleth(data, {
        // Define what  property in the features to use
        valueProperty: `GDP_${year}`,
    
        // Set color scale
        scale: ["red","yellow","green"],
    
        // Number of breaks in step range
        steps:15,
    
        // q for quartile, e for equidistant, k for k-means
        mode: "q",
        style: {
          // Border color
          color: "#fff",
          weight: 1,
          fillOpacity: 0.8
        },
    
        // Binding a pop-up to each layer
        onEachFeature: function(feature, layer) {
          layer.bindPopup(feature.properties.Country + `<hr>${year} GDP per Capita: $` +
          feature.properties[`GDP_${year}`].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))
             layer.on({
              mouseover: highlightFeature,
              mouseout: resetHighlight2,
          });
        },
        
        
        
      })
      geojson3 = L.choropleth(data, {
        // Define what  property in the features to use
        valueProperty: `COMB_${year}`,
    
        // Set color scale
        scale: ["red","yellow","green"],
    
        // Number of breaks in step range
        steps:15,
    
        // q for quartile, e for equidistant, k for k-means
        mode: "q",
        style: {
          // Border color
          color: "#fff",
          weight: 1,
          fillOpacity: 0.8
        },
    
        // Binding a pop-up to each layer
        onEachFeature: function(feature, layer) {
          layer.bindPopup(feature.properties.Country + `<hr>${year} Combination Scale: ` +
          feature.properties[`COMB_${year}`])
             layer.on({
              mouseover: highlightFeature,
              mouseout: resetHighlight3,
          });
        },
        
        
        
      })
    
    
      // Set up the legend
      
      var baseMaps = {
        "Street Map": b,
        "Dark Map": c
      };
      
      // Overlays that may be toggled on or off
      var overlayMaps = {
        "Choropleth Map":{
        "Quality of Life Index": geojson,
        "GDP per Capita":geojson2,
        "Combination":geojson3
      }};
      

    document.getElementById("map").outerHTML = "";
    d3.select("body").append("div")
        .attr("id", "map")
        .attr("class","col-md-10")
        .attr("style", "float:none;margin:auto;")
    
      var myMap = L.map("map", {
        center: [30.7128, 0],
        zoom: 2,
        layers:[b,geojson]
      });
      
      
    
      var legend = L.control({ position: "bottomright" });
      legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        var limits = geojson.options.limits;
        var colors = geojson.options.colors;
        var labels = [];
    
        // Add min & max
        var legendInfo = `<h1>Quality of Life Index</h1>` +
          "<div class=\"labels\">" +
            "<div class=\"min\">" + limits[0] + "</div>" +
            "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
          "</div>";
    
        div.innerHTML = legendInfo;
    
        limits.forEach(function(limit, index) {
          labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
        });
    
        div.innerHTML += "<ul>" + labels.join("") + "</ul>";
        return div;
      };
      legend.addTo(myMap);
    
      var legend1= L.control({ position: "bottomright" });
      legend1.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        var limits = geojson2.options.limits;
        var colors = geojson2.options.colors;
        var labels = [];
    
        // Add min & max
        var legendInfo = "<h1>GDP per Capita</h1>" +
          "<div class=\"labels\">" +
            "<div class=\"min\">" + "$"+limits[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</div>" +
            "<div class=\"max\">" +"$"+ limits[limits.length - 1].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</div>" +
          "</div>";
    
        div.innerHTML = legendInfo;
    
        limits.forEach(function(limit, index) {
          labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
        });
    
        div.innerHTML += "<ul>" + labels.join("") + "</ul>";
        return div;
      };
    
    
      var legend2 = L.control({ position: "bottomright" });
      legend2.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        var limits = geojson3.options.limits;
        var colors = geojson3.options.colors;
        var labels = [];
    
        // Add min & max
        var legendInfo = `<h1>Combination Scale</h1>` +
          "<div class=\"labels\">" +
            "<div class=\"min\">" + limits[0] + "</div>" +
            "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
          "</div>";
    
        div.innerHTML = legendInfo;
    
        limits.forEach(function(limit, index) {
          labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
        });
    
        div.innerHTML += "<ul>" + labels.join("") + "</ul>";
        return div;
      };
      // Adding legend to the map
      myMap.on('overlayadd', function(eventLayer){
        if (eventLayer.name == 'GDP per Capita'){
          legend1.addTo(this);
        } 
        // else if(eventLayer.name != 'Housing Index'){
        //   this.removeControl(legend1)
        // }
      })
    
        myMap.on('overlayadd', function(eventLayer){
          if (eventLayer.name == 'Quality of Life Index'){
            legend.addTo(this);
          } 
          // else if(eventLayer.name != 'Quality of Life Index'){
          //   this.removeControl(legend)
          // }
        })
        myMap.on('overlayadd', function(eventLayer){
          if (eventLayer.name == 'Combination'){
            legend2.addTo(this);
          } 
          // else if(eventLayer.name != 'Quality of Life Index'){
          //   this.removeControl(legend)
          // }
        })
        
          myMap.on('overlayremove', function(eventLayer){
            if (eventLayer.name == 'Quality of Life Index'){
              this.removeControl(legend)
            } })
    
            myMap.on('overlayremove', function(eventLayer){
              if (eventLayer.name == 'GDP per Capita'){
                this.removeControl(legend1)
              } })
              myMap.on('overlayremove', function(eventLayer){
                if (eventLayer.name == 'Combination'){
                  this.removeControl(legend2)
                } })
      
    function highlightFeature(e) {
        var layer = e.target;
    
        layer.setStyle({
            weight: 5,
            color: 'transparent',
            dashArray: '',
            fillOpacity: 0.9,
        });
    
        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
        }
    }
    function resetHighlight(e) {
      geojson.resetStyle(e.target);
    }

    function resetHighlight2(e) {
      geojson2.resetStyle(e.target);
    }

    function resetHighlight3(e) {
      geojson3.resetStyle(e.target);
    }
    var options = {
      // Make the "Landmarks" group exclusive (use radio inputs)
      exclusiveGroups: ["Choropleth Map"],
      // Show a checkbox next to non-exclusive group labels for toggling all
      groupCheckboxes: true
    };
    var layerControl = L.control.groupedLayers(baseMaps, overlayMaps, options);
    myMap.addControl(layerControl);
    
    // L.control.layers(baseMaps).addTo(myMap);
    // L.control.layers(overlayMaps).addTo(myMap);
    
});
    
    }
 

    function init(){
      var selector = d3.select("#selDataset");
      for(var i=2012; i<2017;i++){
        selector
        
            .append("option")
            .text(i)
            .property("value", i)
            .attr("class","options");
        const firstYear = "2012"
        
        createChorpleth(firstYear)
        
      }}
    
      function optionChanged(newYear) {
        // Fetch new data each time a new sample is selected
        
        createChorpleth(newYear);
        
      }
    
    
    init()
    