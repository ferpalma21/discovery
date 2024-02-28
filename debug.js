
const options = {};

options.port = parseInt(process.argv[2]) || 5000;

var type = process.argv.indexOf('--release', 1) !== -1 || process.argv.indexOf('release', 1) !== -1 ? 'release' : 'debug';
// type = 'debug'
require('total4/' + type)(options);
