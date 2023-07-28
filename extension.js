// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const TSD_HELPER = require('./helper');
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('turbo-system-debug is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('turbo-system-debug.log', async () => {

		const editor = vscode.window.activeTextEditor;

		try {
			if(!editor){
				throw 'No active editor!';

			}else{				
				const document = editor.document;
				const selection = editor.selections[0];
				const text = document.getText(selection);
				vscode.window.showInformationMessage(text);
			}

		} catch (error) {
			vscode.window.showErrorMessage(error);
		}
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
