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

const lines = {
  type: 'FeatureCollection',
  features: []
};
const triangles = delaunay.triangles;
for (let i = 0; i < triangles.length; i += 3) {
  for (let j = 0; j < 3; j++) {
    lines.features.push({
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: [
          points[triangles[i+j]],
          points[triangles[i+((j+1)%3)]]
        ]
      }
    });
  }
}

const output = JSON.stringify(lines);
fs.writeFile(path.resolve(__dirname, '../data/kr_village_delaunay.json'), output, 'utf8', (err) => {
  if (err) throw err;
});

console.log('input:', geodata.features.length, ' delaunay:', lines.features.length);