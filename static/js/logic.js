// Create map object
var myMap = L.map("map", {
  center: [40.7128, -74.0059],
  zoom: 4
})

// Create and add tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "©️ <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> ©️ <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  }).addTo(myMap);


// Store API query URL
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Function to set marker color based on magnitude using a ternary operator (takes a condition followed by a ?)
function getColor(mag){
  return mag > 5 ? "#d73027":
      mag > 4 ? "#fc8d59" :
      mag > 3 ? "#fee08b":
      mag > 2 ? "#d9ef8b":
      mag > 1 ? "#91cf60":
      "#1a9850";
}

// Perform a GET request to the query URL: plot markers on map
d3.json(url, function(data) {

  for (var i = 0; i < data.features.length; i++) {
      
      // Extract coordinates, magnitude, location name, and date of earthquakes
      var coord = data.features[i].geometry.coordinates;
      var mag = data.features[i].properties.mag;
      var date = new Date(data.features[i].properties.time);
      var loc_name = data.features[i].properties.place;

      // Circle markers
      L.circle([coord[1], coord[0]], {
          color: "#E3E3E3",
          weight: 1,
          fillColor: getColor(mag),
          fillOpacity: 0.5,
          radius: mag * 50000 // Readjust radius size 
      }).bindPopup("<h1>" + loc_name + "</h1><hr><h3> Magnitude: " + mag + "</h3>" + "<p>" + date + "</p>") // Add tooltip
      .addTo(myMap);
  }
});

// Create magnitude legend
var legend = L.control({ position: "bottomleft" }); 

// Add layer control
legend.onAdd = function(map) {
  var div = L.DomUtil.create("div", "legend");//Create a div 
  div.innerHTML += "<h4>Magnitude</h4>";

//Create an array for our mag ranges
var magList = [0, 1, 2 , 3 , 4, 5]

for(var i = 1; i < magList.length; i++)
{
    div.innerHTML += "<div><i style='background:" + getColor(magList[i] - 1).toString() + ";'>"
                  + "&nbsp;</i>" + magList[i - 1] + " - " + magList[i]
                  + "</div>"
}

div.innerHTML += "<div><i style='background:" + getColor(100).toString() + ";'>"
+ "&nbsp;</i>" + magList[magList.length - 1] + "+"
+ "</div>"

return div

};

legend.addTo(myMap);