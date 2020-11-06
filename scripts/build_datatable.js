const fs = require('fs');
const path = require('path');

const voronoi = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/kr_village_voronoi_intersection.geojson')));
const delaunay = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/kr_village_delaunay_intersection.geojson')));

const datatable = {};

// voronoi
for (let i = 0; i < voronoi.features.length; i++) {
  const properties = voronoi.features[i].properties;
  datatable[properties.cellid] = {
    voronoiIndex: i
  };
}

// delaunay
for (let i = 0; i < delaunay.features.length; i++) {
  const properties = delaunay.features[i].properties;
  if (datatable[properties.origin] === undefined)
    continue;
  if (datatable[properties.origin].links === undefined)
    datatable[properties.origin].links = {};
  datatable[properties.origin].links[properties.destination] = i;
}

const output = JSON.stringify(datatable);
fs.writeFile(path.resolve(__dirname, '../data/kr_village_datatable.json'), output, 'utf8', (err) => {
  if (err) throw err;
});

console.log('input(voronoi):', voronoi.features.length, ' input(delaunay):', delaunay.features.length, ' output:', Object.keys(datatable).length);
