import { delay } from './utils.js'
import { GmapsQuadradicBezier } from './bezier.js'

let polyLine: google.maps.Polyline[] = [];

export async function visualize(path: google.maps.LatLng[], map: google.maps.Map) {
  const bounds = new google.maps.LatLngBounds();
  for (let i = 0; i < path.length; i++) {
    bounds.extend(path[i]);
  }
  map.panToBounds(bounds);
  map.fitBounds(bounds);
  for (let i = 0; i < path.length; i++) {
    await delay((i == 0) ? 50 : 250);
    addLine(path[i], path[(i + 1) % path.length], map);
  }
}

function addLine(p1: google.maps.LatLng, p2: google.maps.LatLng, map: google.maps.Map) {
  var lineLength = google.maps.geometry.spherical.computeDistanceBetween(p1, p2);
  var lineHeading = google.maps.geometry.spherical.computeHeading(p1, p2);

  // Create a point off the main line to create the curve
  var curveMakerA = google.maps.geometry.spherical.computeOffset(p1, lineLength / 2, lineHeading - 15);
  var curvedLine = new GmapsQuadradicBezier();
  let line: google.maps.Polyline = curvedLine.draw(p1, curveMakerA, p2, 0.001, map);
  polyLine.push(line);
}

export function removeLine() {
  if (polyLine.length) {
    for (let i = 0; i < polyLine.length; i++) {
      polyLine[i].setMap(null);
    }
    polyLine = [];
  }
}
