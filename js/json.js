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

fetchJSONFile('/resources/data.json', function (data) {
    cars = data.cars;
    drivers = data.drivers;
    console.log(cars);
    console.log(drivers);
});

console.log(cars);
console.log(drivers);
