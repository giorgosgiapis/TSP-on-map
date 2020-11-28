export function GmapsQuadradicBezier() {}

GmapsQuadradicBezier.prototype = {
  draw: function(latlong1, latlong2, latlong3, resolution, map) {
    let lat1 = latlong1.lat(),
        long1 = latlong1.lng();
    let lat2 = latlong2.lat(),
        long2 = latlong2.lng();
    let lat3 = latlong3.lat(),
        long3 = latlong3.lng();
  
    var points: any[] = [];
  
    for (let it = 0; it <= 1; it += resolution) {
      points.push(this.getBezier({
        x: lat1,
        y: long1
      }, {
        x: lat2,
        y: long2
      }, {
        x: lat3,
        y: long3
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
          strokeOpacity: 0.8,
          scale: 3
        },
        offset: '0',
        repeat: '17px'
      }],
      strokeColor: 'black'
    });
  
    Line.setMap(map);
  
    return Line;
  },
  B1: function (t: number): number {
    return t * t;
  },
  B2: function (t: number): number {
    return 2 * t * (1 - t);
  },
  B3: function (t: number): number {
    return (1 - t) * (1 - t);
  },
  getBezier: function (C1: any, C2: any, C3: any, percent: number): any {
    var pos: any = {};
    pos.x = C1.x * this.B1(percent) + C2.x * this.B2(percent) + C3.x * this.B3(percent);
    pos.y = C1.y * this.B1(percent) + C2.y * this.B2(percent) + C3.y * this.B3(percent);
    return pos;
  }
};
