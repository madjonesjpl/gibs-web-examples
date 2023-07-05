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
  const parser = new ol.format.WMTSCapabilities();

  searchRequest = {
    "collections": ["C2021957295-LPCLOUD.local.1x1"],
    "bbox": [-180,-90,180,90],
    "datetime": `2021-01-01/2021-01-30`,
    "filter-lang": "cql-json",
  }

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

    fetch(`http://localhost:8081/mosaic/${searchid}/WMTSCapabilities.xml?assets=B07&assets=B05&assets=B04&color_formula=Gamma+RGB+3.5+Saturation+1.7+Sigmoidal+RGB+15+0.35`)
    .then(function (response) {
      return response.text();
    })
    .then(function (text) {
      const result = parser.read(text);
      const eightRes = 0.00439453125;
      const options = ol.source.WMTS.optionsFromCapabilities(result, {
        layer: 'mosaic',
        format: 'image/png',
        // matrixSet: '250m',
        tileGrid: new ol.tilegrid.WMTS({
          origin: [-180, 90],
          resolutions: [
            eightRes,
            eightRes/2,
            eightRes/4,
            eightRes/8,
            eightRes/16,
            eightRes/32,
            eightRes/64,
          ],
          matrixIds: [8,9,10,11,12,13,14],
          tileSize: 512
        })
      });

      var map = new ol.Map({
        layers: [
          new ol.layer.Tile({
            source: new ol.source.OSM(),
          }),
          new ol.layer.Tile({
            source: new ol.source.WMTS(options),
            // extent: [-118.631943, 33.656113, -117.631943, 34.656113],
          })
        ],
        view: new ol.View({
          projection: ol.proj.get('EPSG:4326'),
          extent: [-180, -90, 180, 90],
          center: [-118.13194, 34.156113,],
          zoom: 10,
          minZoom: 8,
          maxZoom: 14
        }),
        target: 'map',
        renderer: ['canvas', 'dom']
      });
    });

    // var layer = L.tileLayer(titilerTemplate, {
    //   searchid: searchid,
    //   // Prevent Leaflet from retrieving non-existent tiles on the borders.
    //   bounds: [
    //     [-89.9999, -179.9999],
    //     [89.9999, 179.9999]
    //   ],
    //   attribution:
    //     '<a href="https://wiki.earthdata.nasa.gov/display/GIBS">' +
    //     'NASA EOSDIS GIBS</a>&nbsp;&nbsp;&nbsp;' +
    //     '<a href="https://github.com/nasa-gibs/web-examples/blob/main/examples/leaflet/ddv-webmercator-epsg3857.js">' +
    //     'View Source' +
    //     '</a>'
    // });
    // map.addLayer(layer);
  })



};