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

        // Function for the first adding markers and positions, if input is empty
        function firstDraw(input, obj, t, s) {
            if (input.value === '') {
                for (var i = 0; i < obj.length; i++) {
                    marker(i);

                    var printedDateElse = '';
                    if (obj[i].pos != undefined) {
                        printedDateElse = formatedDate(new Date(obj[i].pos.t))
                        obj[i].pos
                    }
                    s = s + '<p><b>' + obj[i].name + '</b></p><p>' + printedDateElse + '</p><hr>';
                }

                t.innerHTML = s;
                s = '';
            }
        }

        // Function for delete all markers
        function deleteMarkers() {
            for (var l = 0; l < allMarkers.length; l++) {
                map.removeLayer(allMarkers[l])
            }

            allMarkers = new Array();
        }

        // Function for searching matches and adding car's Id to arrayOfNumber
        function searchMatches(obj, arr, input) {
            var result = input.value;
            if (result.charAt(0) === ' ' && result.charAt(result.length-1) === ' ' && result.length > 1) {
                console.log(result);
                result = input.value.substring(1, result.length-1);
                console.log(result+'.');
            } else if (result.charAt(0) === ' '){
                console.log(result);
                result = input.value.substring(1);
                console.log(result+'.');
            } else if (result.charAt(result.length-1) === ' '){
                console.log(result);
                result = input.value.substring(0, result.length-1);
                console.log(result+'.');
            }
            console.log('answer - .' + result+'.');
            for (var i = 0; i < obj.length; i++) {
                if (obj[i].name.toLowerCase().match(result.toLowerCase())) {
                    arr.push(obj[i].id);
                }
            }
        }

        // Function for adding cars to arrayOfCars
        function prepareMatches(arr1, arr2, t) {
            if (arr1.length > 0) {
                for (var j = 0; j < arr1.length; j++) {
                    arr2.push(cars[arr1[j]-1]);
                }

                arr1 = new Array();
            } else {
                t.innerHTML = 'Нет совпадений';
            }
        }

        // Function for delete old markers and adding new markers and positions
        function drawMatches(arr, t, s) {
            if (arr.length > 0) {

                deleteMarkers();

                for (var k = 0; k < arr.length; k++) {
                    marker(arr[k].id - 1);

                    var printedDate = '';
                    if (arr[k].pos != undefined) {
                        printedDate = formatedDate(new Date(arr[k].pos.t))
                    }
                    s = s + '<p><b>' + arr[k].name + '</b></p><br>' + printedDate + '<hr>';
                }

                t.innerHTML = s;
                s = '';
            }

            arr = new Array();
        }

        // Function for read data
        fetchJSONFile('/resources/data.json', function (data) {
            cars = data.cars;
            drivers = data.drivers;

            firstDraw(mySearchInput, cars, text, string);

            // Function for keyListener in input. Search, prepare and draw matches
            mySearchInput.addEventListener('keyup', function() {
                var arrayOfNumber = new Array();
                var arrayOfCars = new Array();

                searchMatches(cars, arrayOfNumber, mySearchInput);

                prepareMatches(arrayOfNumber, arrayOfCars, text)

                drawMatches(arrayOfCars, text, string)
            })
        });
    }, 3000);
}