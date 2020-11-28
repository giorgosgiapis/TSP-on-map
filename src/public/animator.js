var polyLine = [];
export function animate(path, map) {
    for (var i = 0; i < path.length; i++) {
        addLine(path[i], path[(i + 1) % (path.length)], map);
    }
    //animatePath(line);
}
function addLine(p1, p2, map) {
    var lineLength = google.maps.geometry.spherical.computeDistanceBetween(p1, p2);
    var lineHeading = google.maps.geometry.spherical.computeHeading(p1, p2);
    // Create two points off the main line to create the curve
    var curveMakerA = google.maps.geometry.spherical.computeOffset(p1, lineLength / 3, lineHeading - 60);
    var curveMakerB = google.maps.geometry.spherical.computeOffset(p2, lineLength / 3, -lineHeading + 120);
    var curvedLine = new GmapsCubicBezier();
    var line = curvedLine.draw(p1, curveMakerA, curveMakerB, p2, 1, map);
    polyLine.push(line);
}
export function removeLine() {
    if (polyLine.length) {
        for (var i = 0; i < polyLine.length; i++) {
            polyLine[i].setMap(null);
        }
        polyLine = [];
    }
}
function animatePath(line) {
    var count = 0;
    window.setInterval(function () {
        count = (count + 1) % 200;
        var icons = line.get("icons");
        icons[0].offset = count / 2 + "%";
        line.set("icons", icons);
    }, 20);
}
var GmapsCubicBezier = function () { };
GmapsCubicBezier.prototype = {
    draw: function (latlong1, latlong2, latlong3, latlong4, resolution, map) {
        var lat1 = latlong1.lat();
        var long1 = latlong1.lng();
        var lat2 = latlong2.lat();
        var long2 = latlong2.lng();
        var lat3 = latlong3.lat();
        var long3 = latlong3.lng();
        var lat4 = latlong4.lat();
        var long4 = latlong4.lng();
        var points = [];
        for (var it = 0; it <= 1; it += resolution) {
            points.push(this.getBezier({
                x: lat1,
                y: long1
            }, {
                x: lat2,
                y: long2
            }, {
                x: lat3,
                y: long3
            }, {
                x: lat4,
                y: long4
            }, it));
        }
        var path = [];
        for (var i = 0; i < points.length - 1; i++) {
            path.push(new google.maps.LatLng(points[i].x, points[i].y));
            path.push(new google.maps.LatLng(points[i + 1].x, points[i + 1].y, false));
        }
        var Line = new google.maps.Polyline({
            path: path,
            geodesic: true,
            strokeOpacity: 0.0,
            icons: [{
                    icon: {
                        path: 'M 0,-1 0,1',
                        strokeOpacity: 1,
                        scale: 4
                    },
                    offset: '0',
                    repeat: '20px'
                }],
            strokeColor: 'red'
        });
        Line.setMap(map);
        return Line;
    },
    B1: function (t) {
        return t * t * t;
    },
    B2: function (t) {
        return 3 * t * t * (1 - t);
    },
    B3: function (t) {
        return 3 * t * (1 - t) * (1 - t);
    },
    B4: function (t) {
        return (1 - t) * (1 - t) * (1 - t);
    },
    getBezier: function (C1, C2, C3, C4, percent) {
        var pos = {};
        pos.x = C1.x * this.B1(percent) + C2.x * this.B2(percent) + C3.x * this.B3(percent) + C4.x * this.B4(percent);
        pos.y = C1.y * this.B1(percent) + C2.y * this.B2(percent) + C3.y * this.B3(percent) + C4.y * this.B4(percent);
        return pos;
    }
};
