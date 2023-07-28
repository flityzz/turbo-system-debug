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

	
	console.log('turbo-system-debug is now active!');

	
	let disposable = vscode.commands.registerCommand('turbo-system-debug.log', async () => {

		const editor = vscode.window.activeTextEditor;

		try {
			if(!editor){
				throw 'No active editor!';
			}

			const document = editor.document;
			const selection = editor.selections[0];
			const text = document.getText(selection);
			const lineNumber = selection.active.line;
			const fullText = document.lineAt(selection.end.line).text;

			const heirarchy = TSD_HELPER.getHeirarchy(fullText, lineNumber, document);

			
			//TODO FIX LINE SETTER
			editor.edit(editBuilder => {
				editBuilder.insert(new vscode.Position(lineNumber+1, ';'), `\nSystem.debug('Line: ${lineNumber} | ${heirarchy} -> ${text} '+${text});`);
			});

			// vscode.window.showInformationMessage(`LINE: ${lineNumber} ${heirarchy} -> ${text}`);

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
