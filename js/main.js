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

var cars;
var drivers;

// this requests the file and executes a callback with the parsed result once
//   it is available
fetchJSONFile('/resources/data.json', function (data) {
    cars = data.cars;
    drivers = data.drivers;
    console.log(cars);
    console.log(drivers);
    console.log(cars[2].pos.lat);
});

/**
 * LEAFLET
 */
var map = L.map('map').setView([53.8999, 27.5566], 11);

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png?{foo}', {
    foo: 'bar',
    minZoom: 1,
    maxZoom: 18
}).addTo(map);

//function markers() {
//    var mark = L.marker([cars[0].pos.lat, cars[0].pos.lng]).addTo(map);
//}
//
//var marker0 = markers();

console.log(cars);
console.log(drivers);

var marker1 = L.marker([53.9, 27.6]).addTo(map);
marker1.bindPopup('');
marker1.on('click', function (e) {
    marker1.getPopup().setContent('<b>Yo-yo</b>');
})

setTimeout('', 3000);