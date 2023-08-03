/**
 * GIBS Web Examples
 *
 * Copyright 2013 - 2023 United States Government as represented by the
 * Administrator of the National Aeronautics and Space Administration.
 * All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

window.onload = function () {
  var map = L.map('map', {
    center: [34.156113,-118.13194],
    zoom: 10,
    maxZoom: 14,
    maxBounds: [
      [-120, -220],
      [120, 220]
    ]
  });

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  var template =
    'http://localhost:8080/gibs-{s}.earthdata.nasa.gov/wmts/epsg3857/best/wmts.cgi?' +
    'TIME=2021-01-30T00:00:00Z&layer=HLS_S30_Nadir_BRDF_Adjusted_Reflectance&' +
    'tilematrixset=250m&TileMatrix={z}&TileCol={x}&TileRow={y}&style=default&Format=image%%2Fjpeg&' +
    'BandR=B07&BandG=B05&BandB=B04&Gamma=3.5&Saturation=1.7&Sigmoidal=15:0.35&ddv=true'

  var layer = L.tileLayer(template, {
    tileSize: 256,
    subdomains: 'abc',
    noWrap: true,
    continuousWorld: true,
    // Prevent Leaflet from retrieving non-existent tiles on the
    // borders.
    bounds: [
      [-85.0511287776, -179.999999975],
      [85.0511287776, 179.999999975]
    ],
    attribution:
      '<a href="https://wiki.earthdata.nasa.gov/display/GIBS">' +
      'NASA EOSDIS GIBS</a>&nbsp;&nbsp;&nbsp;' +
      '<a href="https://github.com/nasa-gibs/web-examples/blob/main/examples/leaflet/webmercator-epsg3857.js">' +
      'View Source' +
      '</a>'
  });

  map.addLayer(layer);
};