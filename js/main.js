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