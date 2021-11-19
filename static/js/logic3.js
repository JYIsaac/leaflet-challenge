var myMap = L.map("map", {
    center: [40.7128, -74.0059],
    zoom: 4
})

L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "©️ <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> ©️ <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  }).addTo(myMap);

  //Create a function to associate to magnitude
function getColor(depth)
{
    switch(true){
        case depth > 90:
            return "black";
        case depth > 70:
            return "purple";
        case depth > 50:
            return "red";
        case depth > 30:
            return "orange";
        case depth > 10:
            return "yellow";
        default:
            return "white";
    }
}

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then (data =>{ 
    L.geoJson(data, {
        pointToLayer: (feature, latlng) => {
            return L.circleMarker(latlng, {
                radius: features.properties.mag * 4,
                color: getColor(feature.geometry.coordinates[2]),
                fillColor: getColor(feature.geometry.coordinates[2]),
                fillOpacity: ".7"

            })
         },
         onEachFeature : (feature, layer) => {
             layer.bindPopup(
                 "Magnitude: " + feature.properties.mag
                 +"<br>Depth" + feature.feature.geometry.coordinates[2]
                 +"<br>Location: " + feature.properties.place
             )
         }
    }).addTo(myMap)

    var legend = L.control({
        position : "bottomleft"
    })
    legend.onAdd = function(){
        var div = L.DomUtil.create("div", "Legend") 
        


        div.innerHTML = "<h2>Depths</h2>"


        for(var i = 1; i < depthList.length; i++)
        {
            div.innerHTML += "<div><i style='background-color:" + getColor(depthList[i] - 1).toString() + ";'>"
                          + "&nbsp;</i>" + depthList[i - 1] + " - " + depthList[i]
                          + "</div>"
        }

        div.innerHTML += "<div><i style='background-color:" + getColor(100).toString() + ";'>"
        + "&nbsp;</i>" + depthList[depthList.length - 1] + "+"
        + "</div>"
 

        return div
    }

    legend.addTo(myMap)

})
