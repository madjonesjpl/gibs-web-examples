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
  const endpoint = 'http://localhost:8081';

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

  var titilerTemplate =
    'http://localhost:8081/mosaic/{searchid}/' +
    'tiles/WebMercatorQuad/{z}/{x}/{y}.png?assets=B07&assets=B05&assets=B04&'+
    'color_formula=Gamma+RGB+3.5+Saturation+1.7+Sigmoidal+RGB+15+0.35';

  searchRequest = {
    "collections": ["C2021957295-LPCLOUD.local.1x1"],
    "bbox": [-180,-90,180,90],
    "datetime": `2021-01-01/2021-01-30`,
    "filter-lang": "cql-json",
  }
  // register mosaic query
  fetch(`${endpoint}/mosaic/register`, {
    method:'POST',
    body: JSON.stringify(searchRequest),
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  })
  .then(function (response) {
    return response.json()
  })
  .then(function (json) {
    searchid = json.searchid

    var layer = L.tileLayer(titilerTemplate, {
      searchid: searchid,
      // Prevent Leaflet from retrieving non-existent tiles on the borders.
      bounds: [
        [-89.9999, -179.9999],
        [89.9999, 179.9999]
      ],
      attribution:
        '<a href="https://wiki.earthdata.nasa.gov/display/GIBS">' +
        'NASA EOSDIS GIBS</a>&nbsp;&nbsp;&nbsp;' +
        '<a href="https://github.com/nasa-gibs/web-examples/blob/main/examples/leaflet/ddv-webmercator-epsg3857.js">' +
        'View Source' +
        '</a>'
    });
    map.addLayer(layer);
  })

};