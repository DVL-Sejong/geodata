const fs = require('fs');
const path = require('path');
const turf = require('@turf/turf');

const geojson = fs.readFileSync(path.resolve(__dirname, '../data/kr_village_osm.json'));
const geodata = JSON.parse(geojson);
const voronoi = turf.voronoi(geodata, {});

const result = {
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
fs.writeFile(path.resolve(__dirname, '../data/kr_village_voronoi.json'), output, 'utf8', (err) => {
  if (err) throw err;
  console.log('input:', geodata.features.length, ' voronoi:', voronoi.features.length, ' output:', result.features.length);
});
