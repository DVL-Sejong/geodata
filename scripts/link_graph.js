const fs = require('fs');
const path = require('path');

const voronoi = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/kr_city_county_voronoi_intersection.geojson')));
const delaunay = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/kr_city_county_delaunay_intersection.geojson')));

const data = {};

// voronoi
for (let i = 0; i < voronoi.features.length; i++) {
  const properties = voronoi.features[i].properties;
  data[properties.cellid] = {
    voronoiIndex: i
  };
}

// delaunay
for (let i = 0; i < delaunay.features.length; i++) {
  const properties = delaunay.features[i].properties;
  if (data[properties.origin] === undefined)
    continue;
  if (data[properties.origin].links === undefined)
  data[properties.origin].links = {};
  data[properties.origin].links[properties.destination] = i;
}

const output = JSON.stringify(data);
fs.writeFile(path.resolve(__dirname, '../data/kr_city_county_link_graph.json'), output, 'utf8', (err) => {
  if (err) throw err;
});

console.log('input(voronoi):', voronoi.features.length, ' input(delaunay):', delaunay.features.length, ' output:', Object.keys(data).length);
