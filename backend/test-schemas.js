const mongoose = require('mongoose');
const models = require('./models');

console.log('Schemas Compiled Successfully:');
console.log(Object.keys(models));
process.exit(0);
