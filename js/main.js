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
 * LEAFLET & SEARCH
 */

// Map
var map = L.map('map').setView([53.8999, 27.5566], 11);

// Tile Layer
L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    foo: 'bar',
    minZoom: 1,
    maxZoom: 18
}).addTo(map);

// Markers & Search
window.onload = function () {
    setTimeout(function () {
        var mySearchInput = document.getElementById('search');
        var text = document.getElementById('resSearch');

        var string = '';

        var allMarkers = new Array();

        // Function for date
        function formatedDate(date) {
            var y = date.getFullYear();
            var m;
            if (date.getMonth() < 9) {
                m = '0' + (date.getMonth() + 1);
            } else {
                m = date.getMonth() + 1;
            }
            var d;
            if (date.getDate() < 10) {
                d = '0' + date.getDate();
            } else {
                d = date.getDate();
            }
            var s;
            if (date.getSeconds() < 10) {
                s = '0' + date.getSeconds();
            } else {
                s = date.getSeconds();
            }
            var min;
            if (date.getMinutes() < 10) {
                min = '0' + date.getMinutes();
            } else {
                min = date.getMinutes();
            }
            var h;
            if (date.getHours() < 10) {
                h = '0' + date.getHours();
            } else {
                h = date.getHours();
            }
            return d + '.' + m + '.' + y + ' ' + h + ':' + min + ':' + s;
        }

        // Function for marker
        function marker(param) {
            var marker1;

            if (cars[param].pos != undefined) {
                marker1 = L.marker([cars[param].pos.lat, cars[param].pos.lng]).addTo(map);

                marker1.bindPopup('');
                var date = new Date(cars[param].pos.t);
                var newDate = formatedDate(date);

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
                    marker1.getPopup().setContent('<b>' + cars[param].name + '<br>' + newDate + '<br>' + cars[param].pos.s + ' км/ч' + driverInfo() +
                        '</b>'
                    );
                    map.setView([cars[param].pos.lat, cars[param].pos.lng], 11);
                })
            }

            if (marker1 != undefined) {
                allMarkers.push(marker1);
            }
        }

        // Function for delete all markers
        function deleteMarkers() {
            for (var l = 0; l < allMarkers.length; l++) {
                map.removeLayer(allMarkers[l])
            }

            allMarkers = new Array();
        }

        // Function for read data
        fetchJSONFile('/resources/data.json', function (data) {
            cars = data.cars;
            drivers = data.drivers;

            if (mySearchInput.value === '') {
                for (var i = 0; i < cars.length; i++) {
                    marker(i);

                    var printedDateElse = '';
                    if (cars[i].pos != undefined) {
                        printedDateElse = formatedDate(new Date(cars[i].pos.t))
                    }
                    string = string + '<b>' + cars[i].name + '</b><br><p>' + printedDateElse + '</p><hr>';
                }

                text.innerHTML = string;
                string = '';
            }

            mySearchInput.addEventListener('keyup', function() {
                var arrayOfNumber = new Array();
                var arrayOfCars = new Array();

                for (var i = 0; i < cars.length; i++) {
                    console.log(cars);
                    if (cars[i].name.toLowerCase().match(mySearchInput.value.toLowerCase())) {
                        arrayOfNumber.push(cars[i].id);
                    }
                }

                console.log(arrayOfNumber);

                if (arrayOfNumber.length > 0) {
                    for (var j = 0; j < arrayOfNumber.length; j++) {
                        arrayOfCars.push(cars[arrayOfNumber[j]-1]);
                    }

                    arrayOfNumber = new Array();
                } else {
                    text.innerHTML = 'Нет совпадений';
                }

                console.log(arrayOfCars);

                if (arrayOfCars.length > 0) {

                    deleteMarkers();

                    for (var k = 0; k < arrayOfCars.length; k++) {
                        marker(arrayOfCars[k].id - 1);

                        var printedDate = '';
                        if (arrayOfCars[k].pos != undefined) {
                            printedDate = formatedDate(new Date(arrayOfCars[k].pos.t))
                        }
                        string = string + '<b>' + arrayOfCars[k].name + '</b><br>' + printedDate + '<hr>';
                    }

                    text.innerHTML = string;
                    string = '';
                }

                arrayOfCars = new Array();
            })
        });
    }, 3000);
}