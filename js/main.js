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

/**
 * LEAFLET
 */

// Map
var map = L.map('map').setView([53.8999, 27.5566], 11);

// Tile Layer
L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    foo: 'bar',
    minZoom: 1,
    maxZoom: 18
}).addTo(map);

// Markers
window.onload = function () {
    setTimeout(function () {
        fetchJSONFile('/resources/data.json', function (data) {
            cars = data.cars;
            drivers = data.drivers;
            console.log(cars);
            console.log(drivers);

            function marker(param) {
                var marker1;

                if (cars[param].pos != undefined) {
                    marker1 = L.marker([cars[param].pos.lat, cars[param].pos.lng]).addTo(map);

                    marker1.bindPopup('');
                    var date = new Date(cars[param].pos.t);

                    function driverInfo() {
                        if (cars[param].driverId != undefined) {
                            if (drivers[cars[param].driverId - 1].phone != undefined) {
                                return '<br>' + drivers[cars[param].driverId - 1].name + '<br>' + drivers[cars[param].driverId - 1].phone
                            }
                            return '<br>' + drivers[cars[param].driverId - 1].name;
                        } else {
                            return '';
                        }
                    }

                    marker1.on('click', function (e) {
                        marker1.getPopup().setContent('<b>' + cars[param].name + '<br>' + date + '<br>' + cars[param].pos.s + ' км/ч' + driverInfo() +
                            '</b>'
                        );
                        map.setView([cars[param].pos.lat, cars[param].pos.lng], 11);
                    })
                }
            }

            for (var i = 0; i < cars.length; i++) {
                marker(i);
                console.log(cars[i]);
            }
        });
    }, 3000);
}