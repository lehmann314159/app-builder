let Validator = require('./Validator.js');
let myValidator = new Validator('structure.json');
let NodeServerEngine = require('./NodeServerEngine.js');
let myNSE = new NodeServerEngine();

console.log(myNSE.generate(myValidator.getData()));
