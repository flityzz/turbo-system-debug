const vscode = require('vscode');

const showNoActiveEditorMessage = () => {
    vscode.window.showErrorMessage("TSD: No active editor!");
	throw new Error('TSD: No active editor!');
}

const showNotextHighlightedMessage = () => {
    vscode.window.showWarningMessage('TSD: No text highlighted!');
    throw new Error('TSD: No text highlighted!');
}

const showNoApexFileMessage = () => {
    vscode.window.showWarningMessage('TSD: No apex file!');
    throw new Error('TSD: No apex file!');
}

module.exports = {
    showNoActiveEditorMessage,
    showNotextHighlightedMessage,
    showNoApexFileMessage
}