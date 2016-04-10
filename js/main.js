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
        var countText = document.getElementById('count');

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

                marker1.bindPopup('<p>' + cars[param].name + '<br>' + newDate + '<br>' + cars[param].pos.s + ' км/ч' + driverInfo() +
                    '</p>');

                marker1.on('click', function (e) {
                    marker1.openPopup();
                    map.setView([cars[param].pos.lat, cars[param].pos.lng], 11);
                })
            }

            if (marker1 != undefined) {
                allMarkers.push(marker1);
            } else {
                allMarkers.push(0);
            }
        }

        // Function for the first adding markers and positions, if input is empty
        function firstDraw(input, obj, t, s, ct) {
            if (input.value === '') {
                var count = 0;
                var sumLat = 0;
                var sumLng = 0;

                for (var i = 0; i < obj.length; i++) {
                    marker(i);

                    var printedDateElse = '';
                    if (obj[i].pos != undefined) {
                        printedDateElse = formatedDate(new Date(obj[i].pos.t));
                        count++;
                        sumLat = sumLat + obj[i].pos.lat;
                        sumLng = sumLng + obj[i].pos.lng;
                    }
                    s = s + '<p><b>' + obj[i].name + '</b></p><p>' + printedDateElse + '</p><hr>';
                }

                if (sumLat != 0 && sumLng != 0) {
                    map.setView([sumLat / count, sumLng / count], 11);
                }

                ct.innerHTML = '<p>Показаны все объекты</p>';
                t.innerHTML = s;
                s = '';

                var arr = new Array();

                for (var j = 0; j < obj.length; j++) {
                    arr.push(obj[j]);
                }

                return arr;
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
        function searchMatches(obj, input) {
            var result = input.value.trim();
            var arr = new Array();
            for (var i = 0; i < obj.length; i++) {
                if (obj[i].name.toLowerCase().match(result.toLowerCase())) {
                    arr.push(obj[i].id);
                }
            }
            return arr;
        }

        // Function for adding cars to arrayOfCars
        function prepareMatches(arr1, t, ct) {
            var arr2 = new Array();
            if (arr1.length > 0) {
                for (var j = 0; j < arr1.length; j++) {
                    arr2.push(cars[arr1[j] - 1]);
                }

                arr1 = new Array();
            } else {
                ct.innerHTML = '<p>Ничего не найдено</p>';
                t.innerHTML = '<p></p>';
            }
            return arr2;
        }

        // Function for delete old markers and adding new markers and positions
        function drawMatches(arr, arr2, t, s, ct, obj) {
            var count = 0;

            if (arr.length > 0) {

                deleteMarkers();

                for (var k = 0; k < arr.length; k++) {
                    count++;

                    marker(arr[k].id - 1);

                    var printedDate = '';
                    if (arr[k].pos != undefined) {
                        printedDate = formatedDate(new Date(arr[k].pos.t))
                    }
                    s = s + '<p><b>' + arr[k].name + '</b></p><p>' + printedDate + '</p><hr>';
                }

                if (count < 6) {
                    ct.innerHTML = '<p>Показано ' + count + ' из ' + obj.length + ' объектов</p>';
                } else if (count = 6) {
                    ct.innerHTML = '<p>Показаны все объекты</p>';
                }
                t.innerHTML = s;
                s = '';
            }
            arr2 = arr;
            arr = new Array();
            return arr2;
        }

        // Function for choose a position
        function choose(arr) {
            var all = document.querySelectorAll('b');
            for (var i = 0; i < all.length; i++) {
                var mark;

                (function (number) {
                    all[number].addEventListener('click', function () {
                        if (arr[number].pos != undefined) {
                            mark = allMarkers[number];

                            if (mark != 0) {
                                mark.openPopup();
                                map.setView([arr[number].pos.lat, arr[number].pos.lng], 11);
                            }
                        }
                    });
                })(i);
            }
        }

        // Function for read data
        fetchJSONFile('/resources/data.json', function (data) {
            cars = data.cars;
            drivers = data.drivers;

            var array = firstDraw(mySearchInput, cars, text, string, countText);

            choose(array);

            // Function for keyListener in input. Search, prepare and draw matches
            mySearchInput.addEventListener('keyup', function () {
                var arrayOfNumber = searchMatches(cars, mySearchInput);

                var arrayOfCars = prepareMatches(arrayOfNumber, text, countText);

                array = drawMatches(arrayOfCars, array, text, string, countText, cars);

                choose(array);
            })
        });
    }, 3000);
}