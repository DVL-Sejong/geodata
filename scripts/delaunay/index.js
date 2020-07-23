const fs = require('fs');
const path = require('path');
const d3 = require('d3-delaunay');

const geojson = fs.readFileSync(path.resolve(__dirname, '../../data/kr_village_osm.json'));
const geodata = JSON.parse(geojson);

const points = [];
for (let feature of geodata.features) {
  if (!feature) continue;
  points.push(feature.geometry.coordinates);
}
const delaunay = d3.Delaunay.from(points);
console.log(delaunay);

/*const result = {
  type: 'FeatureCollection',
  features: []
};
for (let i = 0; i < voronoi.features.length; i++) {
  if (!voronoi.features[i])
    continue;

  const feature = voronoi.features[i];
  feature.properties = {
    ...feature.properties,
    ...geodata.features[i].properties
  };
  //feature.geometry = turf.rewind(feature.geometry);

  result.features.push(feature);
}

const output = JSON.stringify(result);
fs.writeFile(path.resolve(__dirname, '../../data/kr_village_delaunay.json'), output, 'utf8', (err) => {
  if (err) throw err;
  console.log('input:', geodata.features.length, ' voronoi:', voronoi.features.length, ' output:', result.features.length);
});
*/