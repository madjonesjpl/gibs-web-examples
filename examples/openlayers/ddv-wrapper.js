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

  var map = new ol.Map({
    view: new ol.View({
      projection: ol.proj.get('EPSG:3857'),
      extent: [-20037508.34, -20037508.34, 20037508.34, 20037508.34],
      center: [-13150387.407222, 4049783.499862],
      zoom: 10,
      minZoom: 8,
      maxZoom: 14
    }),
    target: 'map',
    renderer: ['canvas', 'dom']
  });

  var source = new ol.source.XYZ({
    url: 'http://localhost:8080/gibs-{a-c}.earthdata.nasa.gov/wmts/epsg3857/best/wmts.cgi?' +
      'TIME=2021-01-30T00:00:00Z&layer=HLS_S30_Nadir_BRDF_Adjusted_Reflectance&' +
      'tilematrixset=250m&TileMatrix={z}&TileCol={x}&TileRow={y}&style=default&Format=image%%2Fpng&' +
      'BandR=B07&BandG=B05&BandB=B04&Gamma=3.5&Saturation=1.7&Sigmoidal=15:0.35&ddv=true'
  });

  var base = new ol.layer.Tile({source: new ol.source.OSM()});
  var layer = new ol.layer.Tile({ source: source });

  map.addLayer(base);
  map.addLayer(layer);
};