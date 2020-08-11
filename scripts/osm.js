const { PythonShell } = require('python-shell');
const voronoi = require('./voronoi');
const delaunay = require('./delaunay');

const options = {
  scriptPath: 'scripts',
  args: ['-p', 'village', '-i', 2]
};
PythonShell.run('osm.py', options, (err) => {
  if (err) throw err;
  voronoi();
  delaunay();
});
