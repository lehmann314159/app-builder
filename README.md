# app-builder
A little tool chain for building backend scaffolding for web apps

This is a tool that processes a json file with certain properties and produces:
* OpenAPI documentation
* A node REST server with 5 CRUD endpoints per specified model
* A basic front end to interact with the mongo database via the node server

My aim with this project was to learn the fundamentals of vanilla javascript
and to apply them to the creation of framework-free code generation by writing
tools to automatically create servers based on well-described models.

Future Steps:
* Create a tool that generates a support file for the front end
* Create a front end tool that generates the original structure.json file

To test this out (assumes a mongo server running on localhost):

`% npm install`
`% npm run generateOpenApi`
`% npm run generateNodeServer`
`% npm run startBackEnd &`
`% npm run startFrontEnd`
