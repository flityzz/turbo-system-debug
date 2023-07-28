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

const insertSystemDebug = (lineNumber, text, hierarchy) => {
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) {
        return; 
    }

    activeEditor.edit(editBuilder => {
        
        let currentLine = lineNumber;
        const document = activeEditor.document;
        while (currentLine < document.lineCount) {
            const lineText = document.lineAt(currentLine).text;
            const semicolonIndex = lineText.indexOf(';', 0);
            if (semicolonIndex !== -1) {
                const position = new vscode.Position(currentLine, semicolonIndex + 1);
                editBuilder.insert(position, `\nSystem.debug('Line: ${currentLine + 1} | ${hierarchy} -> ${text} '+${text});`);
                break;
            }
            currentLine++;
        }
    });
}

const getFileName = (fileName) => {

    const parts = fileName.split('\\');
    // Get the last part of the split, which will be the file name with the .cls extension
    const fileNameWithExtension = parts[parts.length - 1];
    
    const className = fileNameWithExtension.slice(0, -4);

    return className;
}



module.exports = {
    getHeirarchy,
    insertSystemDebug
}