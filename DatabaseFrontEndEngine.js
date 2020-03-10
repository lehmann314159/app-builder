// The DatabaseFrontEndEngine class is used to generate model-specific classes
// for the Database front end from the structure.json file (via the Validator)

module.exports = class DatabaseFrontEndEngine {
	generate(data) {
		return this.generateHeaders(data)
			+ this.generateModels(data)
		;
	}

	generateHeaders(data) {
		let js = "// models.js -- Generated for this project\n\n";
		js += "// Location of the node server\n";
		js += "var backEndApiServer = ";
		js += "'http://localhost:" + data.nodeProperties.serverPort + "';\n\n";
		return js;
	}

	// The key here is to just mangle the structure of the models in
	// structure.json, then spit out the resulting JSON
	generateModels(data) {
		let js = "var templateList =\n";
		js += JSON.stringify(this.getModelFieldMap(data), null, 4);
		return js;
	}

	// That mangling is abstracted here
	getModelFieldMap(data) {
		let structure = {};
		data.modelList.map(function(aModel) {
			structure[aModel.endpoint] = aModel.fields;
		});
		return structure;
	}
};
