const vscode = require('vscode');
const TSD_HELPER = require('./helper');
const TSD_ERRORS = require('./errorMessages');

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
				TSD_ERRORS.showNoActiveEditorMessage();
			}

			const document = editor.document;
			const selection = editor.selections[0];
			const text = document.getText(selection);
			let formattedSOQL = '';

			if(text == ''){
				TSD_ERRORS.showNotextHighlightedMessage();
			}

			const sqlRegex = /\[\s*([\s\S]*?)\s*\]/;
			const match = text.match(sqlRegex);
			
			if(match){
				const sqlQuery = match[1].trim();
				formattedSOQL = TSD_HELPER.removeCommentsAndFormatSOQL(sqlQuery);
			}

			const lineNumber = selection.active.line;
			const fullText = formattedSOQL != '' ? formattedSOQL : document.lineAt(selection.end.line).text;

			const heirarchy = TSD_HELPER.getHeirarchy(fullText, lineNumber, document);

			let sqlOrText = formattedSOQL != '' ? formattedSOQL : text;
			TSD_HELPER.insertSystemDebug(lineNumber, sqlOrText, heirarchy);	

		} catch (error) {
			vscode.window.showErrorMessage(error);
		}
	});

	context.subscriptions.push(disposable);

	disposable = vscode.commands.registerCommand('turbo-system-debug.removeAllSystemDebug', async () => {

		const editor = vscode.window.activeTextEditor;

		try {

			if (!editor) {
				TSD_ERRORS.showNoActiveEditorMessage();
			}

			TSD_HELPER.removeAllSystemDebug(editor);

		} catch (error) {
			vscode.window.showErrorMessage(error);
		}

	})

	context.subscriptions.push(disposable);
}


function deactivate() {}

module.exports = {
	activate,
	deactivate
}
