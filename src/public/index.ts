import { visualize, removeLine } from './drawer.js'
import { delay, genId, resetId, createForm } from './utils.js'
import { Node } from './types'

declare global {
  interface Window { initMap: any; }
}

let map: google.maps.Map;
let infoWindow: google.maps.InfoWindow;
let markerCount: number = 0;
let bounds: google.maps.LatLngBounds;
var idMap: { [id: number]: google.maps.Marker } = {};
let drawing: boolean = false;

function updateBounds() {
  bounds = new google.maps.LatLngBounds();
  for (let key in idMap) {
    bounds.extend(idMap[key].getPosition());
  }
  if (markerCount > 2) {
    map.panToBounds(bounds);
    map.fitBounds(bounds);
  }
}

function setupMap(map: google.maps.Map) {
  const centerUSA = new google.maps.LatLng(39.5, -105.7);
  map.set("zoom", 4);
  map.set("center", centerUSA);
  map.set("streetViewControl", false);
  map.set("mapTypeControl", false);
}

function handleInput(id: any, label: string): void {
  idMap[id].setTitle(label);
  infoWindow.close();
}

async function initMap() {
  const centerUSA = new google.maps.LatLng(39.5, -105.7);
  map = new google.maps.Map(document.getElementById("map") as HTMLElement);
  setupMap(map);

  bounds = new google.maps.LatLngBounds();
  infoWindow = new google.maps.InfoWindow();

  const input_div = document.getElementById("pac-input") as HTMLDivElement;
  const algoSelector = document.getElementById("algo-select") as HTMLDivElement;
  const helpBtn = document.getElementById("help-btn") as HTMLButtonElement;
  const searchBox = new google.maps.places.SearchBox((<HTMLInputElement>input_div.firstChild));

  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input_div);
  map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(algoSelector);
  map.controls[google.maps.ControlPosition.TOP_RIGHT].push(helpBtn);

  await delay(1000);

  input_div.style.visibility = 'visible';
  algoSelector.style.visibility = 'visible';
  helpBtn.style.visibility = 'visible';


  map.addListener("click", (e) => {
    if (drawing) return;
    infoWindow.close();
    placeMarker(e.latLng, map);
  });

  // Bias the SearchBox results towards current map's viewport.
  map.addListener("bounds_changed", () => {
    searchBox.setBounds(map.getBounds() as google.maps.LatLngBounds);
  });

  searchBox.addListener("places_changed", () => {
    if (drawing) return;
    infoWindow.close();
    const places = searchBox.getPlaces();
    if (places.length != 1) {
      return;
    }
    const place = places[0];
    placeMarker(place.geometry.location, map, true, place.name);
  });

  infoWindow.addListener("domready", () => {
    var submitBtn = document.getElementById("clickable-item") as HTMLButtonElement;
    var input_field = document.getElementById("rename-label") as HTMLInputElement;
    input_field.addEventListener("keyup", (e) => {
      if (e.key == 'Enter') {
        submitBtn.click();
      }
    })
    submitBtn.addEventListener("click", () => {
      if (drawing) return;
      handleInput(input_field.getAttribute("node_id"), input_field.value.toString());
    })
  });
};

function placeMarker(position, map, fromSearch = false, title?): void {
  if (!title) title = null;
  var marker = new google.maps.Marker({
    position: position,
    map: map,
    draggable: true,
    title: title,
    animation: google.maps.Animation.DROP,
  });
  marker.set("id", genId());
  markerCount++;
  if (markerCount == 1) {
    map.set("zoom", fromSearch ? 16 : 8);
  }
  marker.addListener('click', () => {
    if (drawing) return;
    infoWindow.close();
    if (marker.getTitle() == null) {
      infoWindow.setContent(createForm(marker.get("id")));
    } else {
      infoWindow.setContent(createForm(marker.get("id"), marker.getTitle().toString()));
    }
    infoWindow.open(map, marker);
  });
  marker.addListener('dragend', () => {
    updateBounds();
  });
  marker.addListener('rightclick', () => {
    infoWindow.close();
    delMarker(marker.get("id"));
  });
  marker.addListener('drag', () => {
    infoWindow.close();
    removeLine();
  });
  map.panTo(position);
  idMap[marker.get("id")] = marker;
  removeLine();
  bounds.extend(position);
  if (markerCount > 1) {
    map.panToBounds(bounds);
    map.fitBounds(bounds);
  }
}

function setDrag(value: boolean): void {
  for (let key in idMap) {
    let marker = idMap[key];
    marker.setDraggable(value);
  }
}

function delMarker(id: number): void {
  const node = idMap[id];
  node.setMap(null);
  delete idMap[id];
  markerCount--;
  removeLine();
  updateBounds();
}

const button = document.getElementById("goButton") as HTMLButtonElement;
const resetButton = document.getElementById("reset") as HTMLButtonElement;

resetButton.addEventListener('click', (e) => {
  if (drawing) return;
  for (let key in idMap) {
    let marker = idMap[key];
    marker.setMap(null);
  }
  resetId();
  markerCount = 0;
  idMap = {};
  removeLine();
  bounds = new google.maps.LatLngBounds();
  infoWindow.close();
  const input_div = document.getElementById("pac-input") as HTMLDivElement;
  const input = input_div.firstChild as HTMLInputElement;
  input.value = '';
  setupMap(map);
});

button.addEventListener('click', (e) => {
  if (drawing) return;
  let dataArray: Array<Node> = new Array();
  for (let key in idMap) {
    let curNode: Node = { id: +key, LatLng: idMap[key].getPosition() };
    dataArray.push(curNode)
  }
  const algorithm = (<HTMLInputElement>document.getElementById("algorithms")).value;
  fetch('/go', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      "algorithm": algorithm,
      "data": dataArray
    })
  })
    .then(res => {
      if (res.status == 200 || res.status == 400 || res.status == 501) {
        return res.json();
      }
      throw new Error('Request failed.')
    })
    .then(async resJson => {
      if (resJson.type == 'error') {
        alert(resJson.errorMsg);
      } else {
        infoWindow.close();
        removeLine();
        let points: google.maps.LatLng[] = resJson.data.map(id => {
          return idMap[id].getPosition();
        });
        drawing = true;
        setDrag(false);
        await delay(200);
        await visualize(points, map);
        drawing = false;
        setDrag(true);
      }
    })
    .catch(function (error) {
      console.log(error);
    });
});

window.initMap = initMap || {};