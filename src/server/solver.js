var Graph = require('./graph.js');
function haversineDistance(point1, point2) {
    var R = 3958.8; // Radius of the Earth in miles
    var rlat1 = point1.lat * (Math.PI / 180); // Convert degrees to radians
    var rlat2 = point2.lat * (Math.PI / 180); // Convert degrees to radians
    var difflat = rlat2 - rlat1; // Radian difference (latitudes)
    var difflon = (point2.lng - point1.lng) * (Math.PI / 180); // Radian difference (longitudes)
    var dist = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat / 2) * Math.sin(difflat / 2) + Math.cos(rlat1) * Math.cos(rlat2) * Math.sin(difflon / 2) * Math.sin(difflon / 2)));
    return dist * 1.609344;
}
exports.solve = function solve(algo, points) {
    var graph = new Graph();
    for (var _i = 0, points_1 = points; _i < points_1.length; _i++) {
        var point = points_1[_i];
        graph.addNode(point.id);
    }
    for (var i = 0; i < points.length; i++) {
        for (var j = i + 1; j < points.length; j++) {
            var dist = haversineDistance(points[i].LatLng, points[j].LatLng);
            graph.addEdge(points[i].id, points[j].id, dist);
        }
    }
    var order;
    if (algo == 'dp') {
        order = graph.TSPSolverDP();
    }
    return order;
};
