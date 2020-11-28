const Graph = require('./graph.js')

function haversineDistance(point1: any, point2: any): number {
  let R = 3958.8; // Radius of the Earth in miles
  let rlat1 = point1.lat * (Math.PI / 180); // Convert degrees to radians
  let rlat2 = point2.lat * (Math.PI / 180); // Convert degrees to radians
  let difflat = rlat2 - rlat1; // Radian difference (latitudes)
  let difflon = (point2.lng - point1.lng) * (Math.PI / 180); // Radian difference (longitudes)

  let dist = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat / 2) * Math.sin(difflat / 2) + Math.cos(rlat1) * Math.cos(rlat2) * Math.sin(difflon / 2) * Math.sin(difflon / 2)));
  return dist * 1.609344;
}

exports.solve = function solve(algo: string, points: Array<any>): number[] {
  let graph = new Graph();
  for (let point of points) {
    graph.addNode(point.id);
  }
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      let dist = haversineDistance(points[i].LatLng, points[j].LatLng);
      graph.addEdge(points[i].id, points[j].id, dist);
    }
  }
  let order: number[];
  if (algo == 'dp') {
    order = graph.TSPSolverDP();
  }
  return order;
}