const { PythonShell } = require('python-shell');
const voronoi = require('./voronoi');
const delaunay = require('./delaunay');

const options = {
  scriptPath: 'scripts',
  args: ['-c', process.argv[2], '-p', process.argv[3], '-o', process.argv[4], '-i', 2]
};

const polygonCalc = () => {
  voronoi(options.args[1], options.args[3]);
  delaunay(options.args[1], options.args[3]);
};

if (options.args[5] == 'skip') {
  polygonCalc();
} else {
  PythonShell.run(`osm_${options.args[1]}.py`, options, (err, data) => {
    if (err) throw err;
    console.log(data[data.length-1]);
    polygonCalc();
  });
}
