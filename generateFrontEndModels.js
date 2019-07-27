let Validator = require('./Validator.js');
let myValidator = new Validator('structure.json');
let DatabaseFrontEndEngine = require('./DatabaseFrontEndEngine.js');
let myDBFES = new DatabaseFrontEndEngine();

console.log(myDBFES.generate(myValidator.getData()));
