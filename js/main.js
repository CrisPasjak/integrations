/**
 * JSON
 */
function fetchJSONFile(path, callback) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState === 4) {
            if (httpRequest.status === 200) {
                var data = JSON.parse(httpRequest.responseText);
                if (callback) callback(data);
            }
        }
    };
    httpRequest.open('GET', path);
    httpRequest.send();
}

// this requests the file and executes a callback with the parsed result once
//   it is available
fetchJSONFile('/resources/data.json', function (data) {
    // do something with your data

    for (var i = 0; i < data.cars.length; i++) {

    }

    console.log(data);
});

/**
 * LEAFLET
 */
var map = L.map('map').setView([53.8999, 27.5566], 12);

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png?{foo}', {
    foo: 'bar',
    minZoom: 1,
    maxZoom: 18
}).addTo(map);

var marker1 = L.marker([53.9, 27.6]).addTo(map);
marker1.bindPopup('<b>Yo-yo</b>');
marker1.on('click', function (e) {
    marker1.getPopup().setContent('<b>Yo-yo</b>');
})

