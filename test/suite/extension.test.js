const { getHeirarchyTestSuite } = require('./getHeirarchyTest');
const { getFileNameTestSuite } = require('./getFileNameTest');
const { insertSystemDebugSuite } = require('./insertSystemDebugTest');

const vscode = require('vscode');


suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	getHeirarchyTestSuite();
	getFileNameTestSuite();
	insertSystemDebugSuite();

});
