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

  // Slider based off January 1st, 2021
  var Jan01 = new Date('2021-01-01');

  // Selected day to show on the map
  var day = new Date(Jan01.getTime());

  // GIBS needs the day as a string parameter in the form of YYYY-MM-DD.
  // Date.toISOString returns YYYY-MM-DDTHH:MM:SSZ. Split at the 'T' and
  // take the date which is the first part.
  function dayParameter() {
    return day.toISOString().split('T')[0];
  };

  var map = L.map('map', {
    center: [34.156113,-118.13194],
    zoom: 10,
    maxZoom: 14,
    maxBounds: [
      [-120, -220],
      [120, 220]
    ],
    fadeAnimation: false
  });

  var update = function () {
    clearLayers();

    // Add the new layer for the selected time
    // map.addLayer(createLayer());
    createLayer();

    // Update the day label
    document.querySelector('#day-label').textContent = dayParameter();
  };

  function clearLayers() {
    map.eachLayer(function (layer) {
      map.removeLayer(layer);
    });
  };

  var titilerTemplate =
    'http://localhost:8081/mosaic/{searchid}/' +
    'tiles/WebMercatorQuad/{z}/{x}/{y}.png?assets=B07&assets=B05&assets=B04&'+
    'color_formula=Gamma+RGB+3.5+Saturation+1.7+Sigmoidal+RGB+15+0.35';

  function createLayer() {
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    date=dayParameter()
    dateObject = new Date(date)

    // data begins on 2021-01-04, so any date before then should return data
    // from the 4th
    date = dateObject< new Date('2021-01-04') ? '2021-01-04' : date

    searchRequest = {
      "collections": ["C2021957295-LPCLOUD.local.1x1"],
      "bbox": [-180,-90,180,90],
      "datetime": `2021-01-01/${date}`,
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
      newSearchId = json.searchid

      var layer = L.tileLayer(titilerTemplate, {
        searchid: newSearchId,
        // Prevent Leaflet from retrieving non-existent tiles on the borders.
        bounds: [
          [-89.9999, -179.9999],
          [89.9999, 179.9999]
        ],
        attribution:
          '<a href="https://wiki.earthdata.nasa.gov/display/GIBS">' +
          'NASA EOSDIS GIBS</a>&nbsp;&nbsp;&nbsp;' +
          '<a href="https://github.com/nasa-gibs/web-examples/blob/main/examples/leaflet/ddv-timeslide.js">' +
          'View Source' +
          '</a>'
      });
      map.addLayer(layer);
    })
  };

  update();

  document.querySelector('#day-slider')
  .addEventListener('change', function (event) {
    // Add the slider value to Jan 01
    var newDay = new Date(Jan01.getTime());
    newDay.setUTCDate(Jan01.getUTCDate() +
      Number.parseInt(event.target.value));
    day = newDay;
    update();
  });

};