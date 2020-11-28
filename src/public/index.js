var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { visualize, removeLine } from './drawer.js';
import { delay, genId, resetId, createForm } from './utils.js';
var map;
var infoWindow;
var markerCount = 0;
var bounds;
var idMap = {};
var drawing = false;
function updateBounds() {
    bounds = new google.maps.LatLngBounds();
    for (var key in idMap) {
        bounds.extend(idMap[key].getPosition());
    }
    if (markerCount > 2) {
        map.panToBounds(bounds);
        map.fitBounds(bounds);
    }
}
function setupMap(map) {
    var centerUSA = new google.maps.LatLng(39.5, -105.7);
    map.set("zoom", 4);
    map.set("center", centerUSA);
    map.set("streetViewControl", false);
    map.set("mapTypeControl", false);
}
function handleInput(id, label) {
    idMap[id].setTitle(label);
    infoWindow.close();
}
function initMap() {
    return __awaiter(this, void 0, void 0, function () {
        var centerUSA, input_div, algoSelector, helpBtn, searchBox;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    centerUSA = new google.maps.LatLng(39.5, -105.7);
                    map = new google.maps.Map(document.getElementById("map"));
                    setupMap(map);
                    bounds = new google.maps.LatLngBounds();
                    infoWindow = new google.maps.InfoWindow();
                    input_div = document.getElementById("pac-input");
                    algoSelector = document.getElementById("algo-select");
                    helpBtn = document.getElementById("help-btn");
                    searchBox = new google.maps.places.SearchBox(input_div.firstChild);
                    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input_div);
                    map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(algoSelector);
                    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(helpBtn);
                    return [4 /*yield*/, delay(1000)];
                case 1:
                    _a.sent();
                    input_div.style.visibility = 'visible';
                    algoSelector.style.visibility = 'visible';
                    helpBtn.style.visibility = 'visible';
                    map.addListener("click", function (e) {
                        if (drawing)
                            return;
                        infoWindow.close();
                        placeMarker(e.latLng, map);
                    });
                    // Bias the SearchBox results towards current map's viewport.
                    map.addListener("bounds_changed", function () {
                        searchBox.setBounds(map.getBounds());
                    });
                    searchBox.addListener("places_changed", function () {
                        if (drawing)
                            return;
                        infoWindow.close();
                        var places = searchBox.getPlaces();
                        if (places.length != 1) {
                            return;
                        }
                        var place = places[0];
                        placeMarker(place.geometry.location, map, true, place.name);
                    });
                    infoWindow.addListener("domready", function () {
                        var submitBtn = document.getElementById("clickable-item");
                        var input_field = document.getElementById("rename-label");
                        input_field.addEventListener("keyup", function (e) {
                            if (e.key == 'Enter') {
                                submitBtn.click();
                            }
                        });
                        submitBtn.addEventListener("click", function () {
                            if (drawing)
                                return;
                            handleInput(input_field.getAttribute("node_id"), input_field.value.toString());
                        });
                    });
                    return [2 /*return*/];
            }
        });
    });
}
;
function placeMarker(position, map, fromSearch, title) {
    if (fromSearch === void 0) { fromSearch = false; }
    if (!title)
        title = null;
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
    marker.addListener('click', function () {
        if (drawing)
            return;
        infoWindow.close();
        if (marker.getTitle() == null) {
            infoWindow.setContent(createForm(marker.get("id")));
        }
        else {
            infoWindow.setContent(createForm(marker.get("id"), marker.getTitle().toString()));
        }
        infoWindow.open(map, marker);
    });
    marker.addListener('dragend', function () {
        updateBounds();
    });
    marker.addListener('rightclick', function () {
        infoWindow.close();
        delMarker(marker.get("id"));
    });
    marker.addListener('drag', function () {
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
function setDrag(value) {
    for (var key in idMap) {
        var marker = idMap[key];
        marker.setDraggable(value);
    }
}
function delMarker(id) {
    var node = idMap[id];
    node.setMap(null);
    delete idMap[id];
    markerCount--;
    removeLine();
    updateBounds();
}
var button = document.getElementById("goButton");
var resetButton = document.getElementById("reset");
resetButton.addEventListener('click', function (e) {
    if (drawing)
        return;
    for (var key in idMap) {
        var marker = idMap[key];
        marker.setMap(null);
    }
    resetId();
    markerCount = 0;
    idMap = {};
    removeLine();
    bounds = new google.maps.LatLngBounds();
    infoWindow.close();
    var input_div = document.getElementById("pac-input");
    var input = input_div.firstChild;
    input.value = '';
    setupMap(map);
});
button.addEventListener('click', function (e) {
    if (drawing)
        return;
    var dataArray = new Array();
    for (var key in idMap) {
        var curNode = { id: +key, LatLng: idMap[key].getPosition() };
        dataArray.push(curNode);
    }
    var algorithm = document.getElementById("algorithms").value;
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
        .then(function (res) {
        if (res.status == 200 || res.status == 400 || res.status == 501) {
            return res.json();
        }
        throw new Error('Request failed.');
    })
        .then(function (resJson) { return __awaiter(void 0, void 0, void 0, function () {
        var points;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(resJson.type == 'error')) return [3 /*break*/, 1];
                    alert(resJson.errorMsg);
                    return [3 /*break*/, 4];
                case 1:
                    infoWindow.close();
                    removeLine();
                    points = resJson.data.map(function (id) {
                        return idMap[id].getPosition();
                    });
                    drawing = true;
                    setDrag(false);
                    return [4 /*yield*/, delay(200)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, visualize(points, map)];
                case 3:
                    _a.sent();
                    drawing = false;
                    setDrag(true);
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    }); })
        .catch(function (error) {
        console.log(error);
    });
});
window.initMap = initMap || {};
