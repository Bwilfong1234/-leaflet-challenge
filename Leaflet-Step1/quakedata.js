const link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
let circles = [];
let m = [];
let geojson;

d3.json(link, function(data) {
    createF(data.features);

})

function markerSize(mag) {
    return mag * 10000;
}

function markerColor(mag) {
    let color = "purple";

    if (mag <= 1) {
        color = "blue"
    } else if (mag > 1 && mag <= 2) {
        color = "green"
    } else if (mag > 2 && mag <= 3) {
        color = "yellow"
    } else if (mag > 3 && mag <= 4) {
        color = "orange"
    } else if (mag > 4 && mag <= 5) {
        color = "red"
    } else if (mag > 5) {
        color = "black"
    }
    return color
}

function createF(earthquakeData) {


    function onFeature(feature, layer) {

        let lats = feature.geometry.coordinates[1];
        let longs = feature.geometry.coordinates[0]

        m = feature.properties.mag;

        circles.push(
            L.circle([lats, longs], {
                stroke: false,
                fillOpacity: 0.75,
                color: "black",
                fillColor: markeCrolor(feature.properties.mag),
                radius: markerSize(feature.properties.mag)
            }).bindPopup("<p>" + feature.properties.place +
                "  Magnitude : " + feature.properties.mag + "</p>")
        );


        console.log(feature.properties.mag)
    }

    const earthquakes = L.geoJSON(earthquakeData, {
        onFeature: onFeature
    });


    createMap(earthquakes);
}

function createMap(earthquakes) {


    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
        "access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw", );

    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?" +
        "access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw", {
            attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
            maxZoom: 18,
            id: "mapbox.dark"
        });


    var baseMaps = {
        "Street Map": streetmap,
        "Dark Map": darkmap
    };


    var quakeLayer = L.layerGroup(circles);


    var overlayMaps = {
        "markers": earthquakes,
        "earthquakes": quakeLayer
    }


    const myMap = L.map("map", {
        center: [
            37.09, -95.71
        ],
        zoom: 5,
        layer: [streetmap, quakeLayer]
    });



    L.control.layers(baseMaps, overlayMaps, quakeLayer, {
        collapsed: false
    }).addTo(myMap);

    const legend = L.control({ position: "bottomright" });

    legend.onAdd = function() {
        const div = L.DomUtil.create("div", "info legend");

        const grades = [0, 1, 2, 3, 4, 5];
        let labels = [];


        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<li style="background:' + markerColor(grades[i + 1]) + '">' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] : '+' + '</li> ')

        }

        return div;
    };
    // Adding legend to the map
    legend.addTo(myMap);


}