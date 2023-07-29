const vscode = require('vscode');

const getHeirarchy = (fullText, lineNumber, document) => {
    
    const fileName = getFileName(document.fileName);

    let firstCharPosition = fullText.search(/\S/);
    let tempLineNumber = lineNumber;
    const heirarchicalKeywords = ['public ', 'private ', 'protected ', 'global ', 'override ']

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
            
            heirarchy.push(methodName)
        }
    }
    
    return `${fileName} -> ${String(heirarchy[0])} `;
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
                const debugStatement = `\n${indentation}System.debug('TSD Line: ${lineNumber + 1} | ${hierarchy} -> ${text} '+${text});`;
                editBuilder.insert(position, debugStatement);
                break;
            }

            if (semicolonIndex !== -1) {
                const position = new vscode.Position(currentLine, semicolonIndex + 1);
                const debugStatement = `\n${indentation}System.debug('TSD Line: ${lineNumber + 1} | ${hierarchy} -> ${text} '+${text});`;
                editBuilder.insert(position, debugStatement);
                break;
            }
            currentLine++;
        }
    });
}

const getFileName = (fileName) => {

    const parts = fileName.split('\\');
    const fileNameWithExtension = parts[parts.length - 1];
    const className = fileNameWithExtension.slice(0, -4);

    return className;
}



module.exports = {
    getHeirarchy,
    insertSystemDebug
}