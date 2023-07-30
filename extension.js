const vscode = require('vscode');
const TSD_HELPER = require('./helper');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	console.log('turbo-system-debug is now active!');

	let disposable;

	disposable = vscode.commands.registerCommand('turbo-system-debug.log', async () => {

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

			TSD_HELPER.insertSystemDebug(lineNumber, text, heirarchy);

		} catch (error) {
			vscode.window.showErrorMessage(error);
		}
	});

	context.subscriptions.push(disposable);

	disposable = vscode.commands.registerCommand('turbo-system-debug.removeAllPrint', async () => {

		const editor = vscode.window.activeTextEditor;

		if (!editor) {
			vscode.window.showErrorMessage("No active editor");
		}

		

	})

	context.subscriptions.push(disposable);
}


function deactivate() {}

module.exports = {
	activate,
	deactivate
}
