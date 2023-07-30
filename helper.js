const vscode = require('vscode');

const getHeirarchy = (fullText, lineNumber, document) => {
    
    const fileName = getFileName(document.fileName);

    let firstCharPosition = fullText.search(/\S/);
    let tempLineNumber = lineNumber;

    if(fullText.includes('(')){
        tempLineNumber = lineNumber+1;
    }

    const heirarchicalKeywords = ['public ', 'private ', 'protected ', 'global ', 'override ', '@IsTest ', 'static ']

    let heirarchy = []

    while (firstCharPosition !== 0) {
        tempLineNumber--
        if (firstCharPosition === 0) {
            break
        }
        let text = document.lineAt(tempLineNumber).text
        let trimedText = text.trim()
        firstCharPosition = text.search(/\S/);
        if (heirarchicalKeywords.some(v => trimedText.startsWith(v))) {
            let splittedWords = trimedText.split(' ')
           
            let methodName;
            splittedWords.map(word => {
                if(word.includes('(')){
                    methodName = word.split('(')[0];
                }
            });
            
            heirarchy.push(methodName+'()')
        }
    }

    let returnString = `${fileName} -> ${String(heirarchy[0])}`;
    
    if (returnString.includes('undefined')) {
        returnString = returnString.split('-> undefined').join('').trimEnd();
    }
    
    return returnString;
}

function insertSystemDebug(lineNumber, text, hierarchy) {
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) {
        return; 
    }

    activeEditor.edit(editBuilder => {
        
        let currentLine = lineNumber;
        const document = activeEditor.document;
        let indentation = '';

        
        const lineText = document.lineAt(currentLine).text;
        const match = lineText.match(/^\s+/);
        if (match) {
            indentation = match[0];
        }

        while (currentLine < document.lineCount) {
            const lineText = document.lineAt(currentLine).text;
            const semicolonIndex = lineText.indexOf(';', 0);
            
            if (lineText.endsWith('{')) { 
                const position = new vscode.Position(currentLine, lineText.length);
                const debugStatement = `\n${indentation}System.debug('LINE ${lineNumber + 1} | ${hierarchy} -> ${text} '+${text});`;
                editBuilder.insert(position, debugStatement);
                break;
            }

            if (semicolonIndex !== -1) {
                const position = new vscode.Position(currentLine, semicolonIndex + 1);
                const debugStatement = `\n${indentation}System.debug('LINE ${lineNumber + 1} | ${hierarchy} -> ${text} '+${text});`;
                editBuilder.insert(position, debugStatement);
                break;
            }
            currentLine++;
        }
    });
}

const removeAllSystemDebug = async (editor) =>{

    let start, end;
    let selection = editor.selection;
    if (selection.isEmpty) {
        start = 0;
        end = editor.document.lineCount - 1;
    } else {
        start = editor.selection.start.line;
        end = editor.selection.end.line;
    }
    let deleteLines = [];
    for (let i = start; i <= end; i++) {
        const line = editor.document.lineAt(i);
        const lineText = line.text.trim();
        if (lineText.startsWith("System.debug('LINE")) {
            deleteLines.push(line.lineNumber);
        }
    }
    for (let i = 0; i < deleteLines.length; i++) {
        const line = editor.document.lineAt(deleteLines[i] - i);
        await editor.edit(editBuilder => {
            editBuilder.delete(line.rangeIncludingLineBreak);
        });
    }

}

const showNoActiveEditorMessage = () => {
    vscode.window.showErrorMessage("No active editor");
	throw 'No active editor!';
}

const getFileName = (fileName) => {
    if (!fileName.includes('cls')) {
        vscode.window.showWarningMessage('no apex file!');
        throw new Error('no apex file');
    }
    const parts = fileName.split('\\');
    const fileNameWithExtension = parts[parts.length - 1];
    const className = fileNameWithExtension.slice(0, -4);

    return className;
}



module.exports = {
    getHeirarchy,
    insertSystemDebug,
    removeAllSystemDebug,
    showNoActiveEditorMessage
}