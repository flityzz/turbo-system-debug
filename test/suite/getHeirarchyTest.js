const assert = require('assert');
const vscode = require('vscode');
const { getHeirarchy } = require('../../helper');

const FILE_PATH = 'D:\\Projects\\Turbo system debug\\turbo-system-debug\\test\\suite\\testFiles\\TestClass.cls';

const getHeirarchyTestSuite = () => {

	test('getHeirarchyTest => should return hierarchy for basic input', async () => {
		
		const fullText = '        // Some code here'
		const lineNumber = 4;
		
		const uri = vscode.Uri.file(FILE_PATH);
    	const document = await vscode.workspace.openTextDocument(uri);

		const result = getHeirarchy(fullText, lineNumber, document);
		assert.strictEqual(result, 'TestClass -> testMethod()');
	});

	test('getHeirarchyTest => should return hierarchy with @IsTest annotation', async () => {
		const fullText = `        // Test code here`;
		const lineNumber = 8;

		const uri = vscode.Uri.file(FILE_PATH);
    	const document = await vscode.workspace.openTextDocument(uri);

		const result = getHeirarchy(fullText, lineNumber, document);
		assert.strictEqual(result, 'TestClass -> testMethodIsTestannotation()');
	});

	test('getHeirarchyTest => should return hierarchy with SQL text', async () => {
		const fullText = `return [
			// Return whatever the component needs
			SELECT Name
			FROM Account
			WHERE NumberOfEmployees >= :numberOfEmployees
		  ];`;
		const lineNumber = 14;

		const uri = vscode.Uri.file(FILE_PATH);
    	const document = await vscode.workspace.openTextDocument(uri);

		const result = getHeirarchy(fullText, lineNumber, document);
		assert.strictEqual(result, 'TestClass -> testMethodSQL()');
	});

	test('getHeirarchyTest => should return hierarchy with @AuraEnabled annotation', async () => {
		const fullText = `    // Test code here`;
		const lineNumber = 24;

		const uri = vscode.Uri.file(FILE_PATH);
    	const document = await vscode.workspace.openTextDocument(uri);

		const result = getHeirarchy(fullText, lineNumber, document);
		assert.strictEqual(result, 'TestClass -> testMethodAuraEnabled()');
	});

	test('getHeirarchyTest => should return hierarchy for selection param line', async () => {
		const fullText = `  public static List<Account> testSelectParamLine(Decimal annualRevenue) {`;
		const lineNumber = 27;

		const uri = vscode.Uri.file(FILE_PATH);
    	const document = await vscode.workspace.openTextDocument(uri);

		const result = getHeirarchy(fullText, lineNumber, document);
		assert.strictEqual(result, 'TestClass -> testSelectParamLine()');
	});
}

module.exports = {
	getHeirarchyTestSuite
}
