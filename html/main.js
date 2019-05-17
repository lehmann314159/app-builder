// main.js -- vanilla DOM stuff

////////////
// Models //
////////////

function getModelName() {
	if (sessionStorage.getItem('modelName') == 'null') {
		return null;
	}
	return sessionStorage.getItem('modelName');
}

function setModelName(inValue) {
	sessionStorage.setItem('modelName', inValue);
}

// templateList is generated and defined in models.js
function getModelNameList() {
	return [...(Object.keys(templateList)).sort()];
}


///////////////
// Documents //
///////////////

function getDocumentId() {
	if (sessionStorage.getItem('documentId') == 'null') {
		return null;
	}
	return sessionStorage.getItem('documentId');
}

function setDocumentId(inValue) {
	sessionStorage.setItem('documentId', inValue);
}

function getDocumentList(inModelName) {
	return JSON.parse(sessionStorage.getItem(`${inModelName}Documents`));
}

function setDocumentList(inModelName, inList) {
	sessionStorage.setItem(`${inModelName}Documents`, JSON.stringify(inList));
}

function getDocumentDetails(inDocumentId) {
	return sessionStorage.getItem(inDocumentId);
}

function setDocumentDetails(inDocumentId, inData) {
	sessionStorage.setItem(inDocumentId, inData);
}

// templateList is generated and defined in models.js
function getDocumentTemplate(inModelName) {
	return templateList[inModelName];
}

// templateList is generated and defined in models.js
// yes, this is recursive
// getDocumentHeight helps us make the textarea the right size
function getDocumentHeight(inObject) {
	let count = 2; // For the 2 brackets

	let childObjectList = [];
	for (const aChild in inObject) {
		if (typeof(inObject[aChild]) == 'object') {
			childObjectList.push(inObject[aChild]);
		} else {
			count++; // non-object properties are one row
		}
	}

	// Return our count plus the count of our object children
	return childObjectList.reduce(
		(childCount, currentChild) => childCount + getDocumentHeight(currentChild),
		count
	);
}


//////////
// Mode //
//////////

function getMode() {
	if (sessionStorage.getItem('mode') == 'null') {
		return null;
	}
	return sessionStorage.getItem('mode');
}

function setMode(inValue) {
	sessionStorage.setItem('mode', inValue);
}


///////////////////////
// State Maintenance //
///////////////////////

// ensure that state is coherent
function stateIsCoherent() {
	switch (getMode()) {
		// DISPLAY is almost always ok
		case 'DISPLAY':
			return true;
			break;

		// EDIT requires that model and document are set
		case 'EDIT':
			return getModelName() && getDocumentId()
			break;

		// DELETE requires that model and document are set
		case 'DELETE':
			return getModelName() && getDocumentId()
			break;

		// CREATE requires that model is set
		case 'CREATE':
			return getModelName();
			break;

		// SAVE requires that model is set
		case 'SAVE':
			return getModelName();
			break;

		// CANCEL requires that model is set
		case 'CANCEL':
			return getModelName();
			break;

		// Just in case
		default:
			return false;
			break;
	}
}

// get displaySettings
// This lets us easily figure out which element to show/hide
function getDisplaySettings() {
	if (!stateIsCoherent) {
		return null;
	}

	switch (getMode()) {
		case 'DISPLAY': return {
			'modelSelect':    'block',
			'documentSelect': getModelName() ? 'block' : 'none',
			'displayContent': getDocumentId() ? 'block' : 'none',
			'modifyContent':  'none',
			'editButton':     getModelName() && getDocumentId() ? 'block' : 'none',
			'deleteButton':   getModelName() && getDocumentId() ? 'block' : 'none',
			'createButton':   getModelName() ? 'block' : 'none',
			'saveButton':     'none',
			'cancelButton':   'none'
		};
		break;

		case 'EDIT': return {
			'modelSelect':    'block',
			'documentSelect': 'block',
			'displayContent': 'none',
			'modifyContent':  'block',
			'editButton':     'none',
			'deleteButton':   'none',
			'createButton':   'none',
			'saveButton':     'block',
			'cancelButton':   'block'
		};
		break;

		case 'DELETE': return {
			'modelSelect':    'block',
			'documentSelect': 'block',
			'displayContent': 'none',
			'modifyContent':  'none',
			'editButton':     'none',
			'deleteButton':   'none',
			'createButton':   'none',
			'saveButton':     'none',
			'cancelButton':   'none'
		};
		break;

		case 'CREATE': return {
			'modelSelect':    'block',
			'documentSelect': 'none',
			'displayContent': 'none',
			'modifyContent':  'block',
			'editButton':     'none',
			'deleteButton':   'none',
			'createButton':   'none',
			'saveButton':     'block',
			'cancelButton':   'block'
		};
		break;

		case 'SAVE': return {
			'modelSelect':    'block',
			'documentSelect': 'block',
			'displayContent': 'none',
			'modifyContent':  'none',
			'editButton':     'none',
			'deleteButton':   'none',
			'createButton':   'none',
			'saveButton':     'none'
		};
		break;

		case 'CANCEL': return {
			'modelSelect':    'block',
			'documentSelect': 'block',
			'displayContent': 'none',
			'modifyContent':  'none',
			'editButton':     'none',
			'deleteButton':   'none',
			'createButton':   'none',
			'saveButton':     'none'
		};
		break;
	};
}

// Uses state to physically show/hide elements
function paint() {
	const settings = getDisplaySettings();
	for (const el in settings) {
		document.getElementById(el).style.display = settings[el];
	}
}


////////////////////////
// Element Population //
////////////////////////

// Populates the Model Select
function populateModelSelect() {
	// clear the select boxes, document id
	modelSelect.options.length = 0;
	documentSelect.options.length = 0;

	// Add the starter option
	let starter = document.createElement('option');
	starter.appendChild(document.createTextNode('Select Model'));
	modelSelect.appendChild(starter);
	modelSelect.options[0].selected = 'selected';
	modelSelect.options[0].disabled = true;

	// add each model to the select
	for (const modelName of getModelNameList()) {
		let opt = document.createElement('option');

		// create text node to add to option element (opt)
		opt.appendChild(document.createTextNode(modelName));

		// set value property of opt
		opt.value = modelName;

		// add opt to end of select box (sel)
		modelSelect.appendChild(opt); 
	}

	// refresh the screen
	paint();
}

// Populates the Document Select
function populateDocumentSelect() {
	// clear the select box
	documentSelect.options.length = 0;

	// Add the starter option
	let starter = document.createElement('option');
	starter.appendChild(document.createTextNode('Select Document'));
	documentSelect.appendChild(starter);
	documentSelect.options[0].selected = 'selected';
	documentSelect.options[0].disabled = true;

	// Add the selectable options
	for (const documentName of getDocumentList(getModelName())) {
		let opt = document.createElement('option');

		// create text node to add to option element (opt)
		opt.appendChild(document.createTextNode(documentName));

		// set value property of opt
		opt.value = documentName;

		// add opt to end of select box (sel)
		documentSelect.appendChild(opt); 
	}
	paint();
}

// Populates the read-only document display
function populateDisplayContent() {
	displayContent.innerHTML = getDocumentDetails(getDocumentId());
	paint();
}

// Populates the editable document display
function populateModifyContent() {
	modifyContent.innerHTML = (getMode() == 'CREATE')
		? JSON.stringify(getDocumentTemplate(getModelName()), null, 2)
		: getDocumentDetails(getDocumentId());

	// Strip out _id (mongo's update method hates it, POST doesn't need it)
	let tempObject = JSON.parse(modifyContent.value);
	delete tempObject['_id'];
	modifyContent.innerHTML = JSON.stringify(tempObject, null, 2);

	modifyContent.rows = (getMode() == 'CREATE')
		? getDocumentHeight(getDocumentTemplate(getModelName()))
		: getDocumentHeight(JSON.parse(getDocumentDetails(getDocumentId())))
	modifyContent.cols = 50;
	paint();
}


////////////////
// Ajax Calls //
////////////////

function makeRequest(inMethod, inEndpoint, inCallback, inData = null) {
	xhr().onload = inCallback;
	xhr().open(inMethod, inEndpoint);
	xhr().setRequestHeader("Content-Type", "application/json");
	xhr().send(inData);
}

function ajaxGetDocumentList() {
	makeRequest('GET', `${backEndApiServer}/${getModelName()}`,
		() => {
		if (xhr().status >= 200 && xhr().status < 300) {
			let responseList = JSON.parse(xhr().responseText);
			setDocumentList(getModelName(),
				responseList.map(responseList => responseList._id));

			// Clear any document that might be stored
			setDocumentId(null);
			displayContent.innerHTML = '';
			modifyContent.innerHTML = '';

			// Enable and populate the document select
			populateDocumentSelect(xhr().responseText);
		} else {
			alert('The request failed!');
		}
	});
}

function ajaxGetDocumentDetails() {
	makeRequest('GET', `${backEndApiServer}/${getModelName()}/${getDocumentId()}`,
		() => {
		if (xhr().status >= 200 && xhr().status < 300) {
			setDocumentDetails(getDocumentId(),
				JSON.stringify(JSON.parse(xhr().responseText), null, 2));
			populateDisplayContent();
		} else {
			alert('The request failed!');
		}
	});
}

function ajaxDeleteDocument() {
	makeRequest('DELETE', `${backEndApiServer}/${getModelName()}/${getDocumentId()}`,
		() => {
		if (xhr().status >= 200 && xhr().status < 300) {
			// clear the document state
			setDocumentId(null);

			// set Mode to DISPLAY and re-populate documentSelect
			setMode('DISPLAY');
			populateDocumentSelect();
		} else {
			alert('The request failed!');
		}
	});
}

function ajaxPostDocument() {
	makeRequest('POST', `${backEndApiServer}/${getModelName()}`,
		() => {
		if (xhr().status >= 200 && xhr().status < 300) {
			ajaxGetDocumentList(); // we added a new document to the list
		} else {
			alert('The request failed!');
		}
	}, modifyContent.value);
}

function ajaxPutDocument() {
	makeRequest('PUT', `${backEndApiServer}/${getModelName()}/${getDocumentId()}`,
		() => {
		if (xhr().status >= 200 && xhr().status < 300) {
			setDocumentDetails(getDocumentId(), modifyContent.value);
			populateDocumentSelect();
		} else {
			alert('The request failed!');
		}
	}, modifyContent.value);
}

////////////////////
// Event Handlers //
////////////////////

function handleSetModel() {
	// Set state
	setModelName(modelSelect.options[modelSelect.selectedIndex].value);
	setMode('DISPLAY');

	// Request new document list
	ajaxGetDocumentList();
}

function handleSetDocument() {
	// set state
	setDocumentId(documentSelect.options[documentSelect.selectedIndex].value);
	setMode('DISPLAY');

	// Request new document details
	ajaxGetDocumentDetails();
}

function handleEditDocument() {
	// set state
	setMode('EDIT');
	populateModifyContent();
}

function handleDeleteDocument() {
	// set state
	setMode('DELETE');

	// delete the document
	// TODO: Obviate race condition with ajaxGetDocumentList() call below
	// -- chained promise, maybe?
	ajaxDeleteDocument();

	// set state to display
	setMode('DISPLAY');

	// refresh the document list
	ajaxGetDocumentList();
}

// Called when createButton is clicked
function handleCreateDocument() {
	// set state
	setMode('CREATE');

	// display selected document
	populateModifyContent();
}

// Called when saveButton is clicked
function handleSaveDocument() {
	// get state, set state

	// Figure out if we're updating or creating
	if (getMode() == 'CREATE') {
		setMode('DISPLAY');
		ajaxPostDocument();
	} else {
		setMode('DISPLAY');
		ajaxPutDocument();
	}
}

// Called when cancelButton is clicked
function handleCancelDocument() {
	// If we're canceling a CREATE, clear the document state
	if (0 && getMode() == 'CREATE') {
		setDocumentId(null);
	}

	// set state -- This might be a no-op
	setMode('CANCEL');

	// Ordinarily we'd rely on a populate method to re-paint
	// But because we might be caneling an edit, we don't want to
	// re-populate documentSelect.  So we'll just leave it as-is
	// and call paint() ourselves
	setMode('DISPLAY');
	paint();
}


///////////////
// Utilities //
///////////////

var ajax;
function xhr() {
	if (!ajax) {
		ajax = new XMLHttpRequest();
	}
	return ajax;
}

// Document Ready
document.addEventListener("DOMContentLoaded", function(event) { 
	// We could use some state
	setModelName(null);
	setDocumentId(null);
	setMode('DISPLAY');

	// Let's store element references
	var modelSelect    = document.getElementById('modelSelect');
	var documentSelect = document.getElementById('documentSelect');
	var displayContent = document.getElementById('displayContent');
	var modifyContent  = document.getElementById('modifyContent');

	// populate modelSelect
	populateModelSelect();
});
