# app-builder
A little tool chain for building scaffolding for web apps

This is a tool that processes a json file with certain properties and produces:
* OpenAPI documentation
* A node REST server with 5 CRUD endpoints per specified model

To test this out (assumes a mongo server running on localhost:

`% npm install`  
`% node generateOpenAPI.js > swagger.yml`  
`% node generateNodeServer.js > index.js`  
