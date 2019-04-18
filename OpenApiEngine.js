module.exports = class OpenApiEngine {
	///////////////////////////////////////////////////////
	// Determines if the passed type is a json primitive //
	///////////////////////////////////////////////////////
	isSwaggerPrimitive(inType) {
		let type = inType.toLowerCase();
		if ((type == 'boolean')
			|| (type == 'integer')
			|| (type == 'number')
			|| (type == 'string')
		) {
			return true;
		}
		return false;	
	}

	//////////////////////////////////
	// Top level Swagger Generation //
	//////////////////////////////////
	generate(data) {
		return this.generateHeaders(data)
			+ this.generateEndpoints(data)
			+ this.generateReferences(data)
		;
	}

	/////////////////////////////////
	// generate header information //
	/////////////////////////////////
	generateHeaders(data) {
		let yml = "";
		yml += "openapi: " + data.openApiProperties.version + "\n";
		yml += "info:\n";
		yml += "  title: " + data.openApiProperties.info.title + "\n";
		yml += "  description: " + data.openApiProperties.info.description + "\n";
		yml += "  version: " + data.openApiProperties.info.version + "\n";
		yml += "  contact:\n";
		yml += "    email: " + data.openApiProperties.info.contact.email + "\n";
		if (data.openApiProperties.hasOwnProperty('tags')) {
			yml += "tags:\n";

			// Iterates through the tags
			for (const tag of data.openApiProperties.tags) {
				yml += "  - name: " + Object.entries(tag)[0][0] + "\n";
				yml += "    description: " + Object.entries(tag)[0][1] + "\n";
			}
		}
		return yml;
	}

	////////////////////////
	// generate endpoints //
	////////////////////////
	generateEndpoints(data) {
		let yml = "paths:\n";
		for (const model of data.modelList) {
			yml += "  /" + model.endpoint + ":\n";
			yml += this.generateGetList(model);
			yml += this.generatePost(model);

			yml += "  /" + model.endpoint + "/{" + model.idName + "}:\n";
			yml += "    parameters:\n";
			yml += "    - name: " + model.idName + "\n";
			yml += "      in: path\n";
			yml += "      description: " + model.idDescription + "\n";
			yml += "      required: true\n";
			yml += "      schema:\n";
			yml += "        type: " + model.idType + "\n";
			yml += this.generateGetDetail(model);
			yml += this.generatePut(model);
			yml += this.generateDelete(model);
		}
		return yml;
	}

	// Per-method helpers
	generateGetList(model) {
		let yml = "";

		yml += "    get:\n";
		// List tags if present
		if (model.hasOwnProperty('tags')) {
			yml += "      tags:\n";
			for (const tag of model.tags) {
				yml += "      -  " + tag + "\n";
			}
		}
		yml += "      summary: " + model.summary + "\n";
		yml += "      description: " + model.description + "\n";
		yml += "      responses:\n";
		yml += "        200:\n";
		yml += "          description: HTTP success\n";
		yml += "          content:\n";
		yml += "            application/json:\n";
		yml += "              schema:\n";
		yml += "                $ref: '#/components/schemas/" + model.refName + "ListResponse'\n";
		return yml;
	}

	generatePost(model) {
		let yml = "";

		yml += "    post:\n";
		// List tags if present
		if (model.hasOwnProperty('tags')) {
			yml += "      tags:\n";
			for (const tag of model.tags) {
				yml += "      -  " + tag + "\n";
			}
		}

		yml += "      summary: " + model.summary + "\n";
		yml += "      description: " + model.description + "\n";
		yml += "      requestBody:\n";
		yml += "        content:\n";
		yml += "          application/json:\n";
		yml += "            schema:\n";
		yml += "              $ref: '#/components/schemas/" + model.refName + "Request'\n";
		yml += "      responses:\n";
		yml += "        201:\n";
		yml += "          description: item created\n";
		yml += "          content:\n";
		yml += "            application/json:\n";
		yml += "              schema:\n";
		yml += "                $ref: '#/components/schemas/" + model.refName + "DetailResponse'\n";
		return yml;
	}

	generateGetDetail(model) {
		let yml = "";
		yml += "    get:\n";

		// List tags if present
		if (model.hasOwnProperty('tags')) {
			yml += "      tags:\n";
			for (const tag of model.tags) {
				yml += "      -  " + tag + "\n";
			}
		}

		yml += "      summary: " + model.summary + "\n";
		yml += "      description: " + model.description + "\n";
		yml += "      responses:\n";
		yml += "        200:\n";
		yml += "          description: item detail\n";
		yml += "          content:\n";
		yml += "            application/json:\n";
		yml += "              schema:\n";
		yml += "                $ref: '#/components/schemas/" + model.refName + "DetailResponse'\n";
		return yml;
	}

	generatePut(model) {
		let yml = "";

		yml += "    put:\n";

		// List tags if present
		if (model.hasOwnProperty('tags')) {
			yml += "      tags:\n";
			for (const tag of model.tags) {
				yml += "      -  " + tag + "\n";
			}
		}

		yml += "      summary: modifies instance of " + model.summary + "\n";
		yml += "      description: modifies instance of " + model.description + "\n";
		yml += "      requestBody:\n";
		yml += "        content:\n";
		yml += "          application/json:\n";
		yml += "            schema:\n";
		yml += "              $ref: '#/components/schemas/" + model.refName + "Request'\n";
		yml += "      responses:\n";
		yml += "        200:\n";
		yml += "          description: updated item\n";
		yml += "          content:\n";
		yml += "            application/json:\n";
		yml += "              schema:\n";
		yml += "                $ref: '#/components/schemas/" + model.refName + "DetailResponse'\n";
		return yml;
	}

	generateDelete(model) {
		let yml = "";

		yml += "    delete:\n";

		// List tags if present
		if (model.hasOwnProperty('tags')) {
			yml += "      tags:\n";
			for (const tag of model.tags) {
				yml += "      -  " + tag + "\n";
			}
		}

		yml += "      summary: deletes instance of " + model.modelName + "\n";
		yml += "      description: deletes instance of " + model.modelName + "\n";
		yml += "      responses:\n";
		yml += "        200:\n";
		yml += "          description: item deleted\n";
		yml += "          content:\n";
		yml += "            application/json:\n";
		yml += "              schema:\n";
		yml += "                properties:\n";
		yml += "                  status:\n";
		yml += "                    type: string\n";
		return yml;
	}

	generateReferences(data) {
		let yml = "components:\n";
		yml += "  schemas:\n";
		for (const model of data.modelList) {
			yml += this.generateModelReference(model);
			yml += this.generateRequestReference(model);
			yml += this.generateResponseDetailReference(model);
			yml += this.generateResponseListReference(model);
		}
		return yml;
	}

	generateModelReference(model) {
		let yml = "    " + model.refName + ":\n";
		yml += "      type: object\n";
		yml += "      properties:\n";
		// Iterates through the fields
		for (const field of Object.entries(model.fields)) {
			yml += "        " + field[0] + ":\n";
			yml += this.typeOrRef(field[1], 10);
			if (model.example.hasOwnProperty(field[0])) {
				yml += "          example: \"" + model.example[field[0]] + "\"\n";
			}
		}

		yml += "    " + model.refName + "List:\n";
		yml += "      type: array\n";
		yml += "      items:\n";
		yml += "        $ref: '#/components/schemas/" + model.refName + "'\n";
		return yml;
	}

	generateRequestReference(model) {
		let yml = "    " + model.refName + "Request:\n";
		yml += "      type: object\n";
		yml += "      properties:\n";
		// Iterates through the fields
		for (const field of Object.entries(model.fields)) {
			// Excluse the id field from the request
			if (field[0] === model.idName) {
				continue;
			}
			yml += "        " + field[0] + ":\n";
			yml += this.typeOrRef(field[1], 10);
			if (model.example.hasOwnProperty(field[0])) {
				yml += "          example: \"" + model.example[field[0]] + "\"\n";
			}
		}
		return yml;
	}

	generateResponseDetailReference(model) {
		let yml = "    " + model.refName + "DetailResponse:\n";
		yml += "      type: object\n";
		yml += "      properties:\n";
		yml += "        status:\n";
		yml += "          type: string\n";
		yml += "        " + model.refName + "Detail:\n";
		yml += "          $ref: '#/components/schemas/" + model.refName + "'\n";
		return yml;
	}

	generateResponseListReference(model) {
		let yml = "    " + model.refName + "ListResponse:\n";
		yml += "      type: object\n";
		yml += "      properties:\n";
		yml += "        status:\n";
		yml += "          type: string\n";
		yml += "        " + model.refName + ":\n";
		yml += "          $ref: '#/components/schemas/" + model.refName + "List'\n";
		return yml;
	}

	typeOrRef(tor, indentLevel) {
		let yml = "";

		// Sets base indent
		let indent = "";
		for (let i = 1; i <= indentLevel; i++) {
			indent += " ";
		}

		// Looks for a pipe -- oneOf behavior
		if (tor.indexOf('|') != -1) {
			yml += indent + "oneOf:\n";
			for (const ator of tor.split('|')) {
				if (this.isSwaggerPrimitive(ator)) {
					yml += indent + "  - type: " + ator + "\n";
				} else {
					yml += indent + "  - $ref: " + "'#/components/schemas/" + ator + "'\n";
				}
			}
			return yml;
		}

		// Just a standard single thing
		if (this.isSwaggerPrimitive(tor)) {
			yml += indent + "type: " + tor + "\n";
		} else {
			yml += indent + "$ref: " + "'#/components/schemas/" + tor + "'\n";
		}
		return yml;
	}
};
