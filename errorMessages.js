const vscode = require('vscode');

const showNoActiveEditorMessage = () => {
    vscode.window.showErrorMessage("TSD: No active editor");
	throw new Error('No active editor!');
}

const showNotextHighlightedMessage = () => {
    vscode.window.showWarningMessage('TSD: No text highlighted');
    throw new Error('TSD: No text highlighted');
}

const showNoApexFileMessage = () => {
    vscode.window.showWarningMessage('no apex file!');
    throw new Error('no apex file');
}

module.exports = {
    showNoActiveEditorMessage,
    showNotextHighlightedMessage,
    showNoApexFileMessage
}