let Validator = require('./Validator.js');
let myValidator = new Validator('structure.json');
let OpenApiEngine = require('./OpenApiEngine.js');
let myOAE = new OpenApiEngine();

console.log(myOAE.generate(myValidator.getData()));
