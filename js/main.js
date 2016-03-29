/**
 * LEAFLET
 */

// Map
var map = L.map('map').setView([53.8999, 27.5566], 11);

// Tile Layer
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png?{foo}', {
    foo: 'bar',
    minZoom: 1,
    maxZoom: 18
}).addTo(map);

// Markers
function marker01() {
    var marker1 = L.marker([cars[0].pos.lat, cars[0].pos.lng]).addTo(map);
    marker1.bindPopup('');
    var date = new Date(cars[0].pos.t);

    function dr() {
        if (cars[0].driverId != undefined) {
            if (drivers[cars[0].driverId - 1].phone != undefined) {
                return '<br>' + drivers[cars[0].driverId - 1].name + '<br>' + drivers[cars[0].driverId - 1].phone
            }
            return '<br>' + drivers[cars[0].driverId - 1].name;
        }
    }

    marker1.on('click', function (e) {
        marker1.getPopup().setContent('<b>' + cars[0].name + '<br>' + date + '<br>' + cars[0].pos.s + ' км/ч' + dr() +
            '</b>'
        )
        ;
    })
}
setTimeout(marker01, 3000);

function marker02() {
    var marker2 = L.marker([cars[1].pos.lat, cars[1].pos.lng]).addTo(map);
    marker2.bindPopup('');
    var date = new Date(cars[1].pos.t);

    function dr() {
        if (cars[1].driverId != undefined) {
            if (drivers[cars[1].driverId - 1].phone != undefined) {
                return '<br>' + drivers[cars[1].driverId - 1].name + '<br>' + drivers[cars[1].driverId - 1].phone
            }
            return '<br>' + drivers[cars[1].driverId - 1].name;
        }
    }

    marker2.on('click', function (e) {
        marker2.getPopup().setContent('<b>' + cars[1].name + '<br>' + 'time' + '<br>' + cars[1].pos.s + ' км/ч' + dr() + '</b>');
    })
}
setTimeout(marker02, 6000);

function marker(param) {
    var marker1 = L.marker([cars[param].pos.lat, cars[param].pos.lng]).addTo(map);
    marker1.bindPopup('');
    var date = new Date(cars[param].pos.t);

    function dr() {
        if (cars[param].driverId != undefined) {
            if (drivers[cars[param].driverId - 1].phone != undefined) {
                return '<br>' + drivers[cars[param].driverId - 1].name + '<br>' + drivers[cars[param].driverId - 1].phone
            }
            return '<br>' + drivers[cars[param].driverId - 1].name;
        }
    }

    marker1.on('click', function (e) {
        marker1.getPopup().setContent('<b>' + cars[param].name + '<br>' + date + '<br>' + cars[param].pos.s + ' км/ч' + dr() +
            '</b>'
        )
        ;
    })
}
setTimeout(marker(2), 9000);