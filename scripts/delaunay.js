const fs = require('fs');
const path = require('path');
const Delaunator = require('delaunator');

const geojson = fs.readFileSync(path.resolve(__dirname, '../data/kr_village_osm.json'));
const geodata = JSON.parse(geojson);

const points = [];
for (let feature of geodata.features) {
  if (!feature) continue;
  points.push(feature.geometry.coordinates);
}
const delaunay = Delaunator.from(points);

let minLon = Infinity, minLat = Infinity, maxLon = -Infinity, maxLat = -Infinity;
for (let point of points) {
  if (point[0] < minLon) minLon = point[0];
  if (point[1] < minLat) minLat = point[1];
  if (point[0] > maxLon) maxLon = point[0];
  if (point[1] > maxLat) maxLat = point[1];
}

const result = {
  type: 'FeatureCollection',
  features: []
};
const triangles = delaunay.triangles;
for (let i = 0; i < triangles.length; i += 3) {
  const feature = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Polygon',
      coordinates: [[
        points[triangles[i]],
        points[triangles[i+1]],
        points[triangles[i+2]]
      ]]
    }
  };

  result.features.push(feature);
}

const output = JSON.stringify(result);
fs.writeFile(path.resolve(__dirname, '../data/kr_village_delaunay.json'), output, 'utf8', (err) => {
  if (err) throw err;
  console.log('input:', geodata.features.length, ' delaunay:', result.features.length);
});
