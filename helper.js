const vscode = require('vscode');
const TSD_ERRORS = require('./errorMessages');

const getHeirarchy = (fullText, lineNumber, document) => {
    
    const fileName = getFileName(document.fileName);

    let firstCharPosition = fullText.search(/\S/);
    let tempLineNumber = lineNumber;
    
    if(fullText.trim().includes('(')){
        tempLineNumber = lineNumber+1;
    }
    
    if(fullText.trim().startsWith('@')){
        tempLineNumber = lineNumber+2;
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

    if(firstCharPosition == 0){
        //SQL text
        while(tempLineNumber != 0){
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
                if(heirarchy.length > 0){
                    break;
                }
            }
            tempLineNumber--;
        }
    }

    let returnString = `${fileName} -> ${String(heirarchy[0])}`;
    
    if (returnString.includes('undefined')) {
        returnString = returnString.split('-> undefined').join('').trimEnd();
    }
    
    return returnString;
}

const insertSystemDebug = (lineNumber, text, hierarchy) => {

    const activeEditor = vscode.window.activeTextEditor;
    
    if (!activeEditor) {
        TSD_ERRORS.showNoActiveEditorMessage();
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

            if (lineText.trim().startsWith('return')) {
                const position = new vscode.Position(currentLine, 0);
                const debugStatement = printDebugStatement(indentation,lineNumber,hierarchy,text,true);
                editBuilder.insert(position, debugStatement);
                break; 
            }
            
            if (lineText.endsWith('{')) { 
                const position = new vscode.Position(currentLine, lineText.length);
                let debugStatement = printDebugStatement(indentation,lineNumber,hierarchy,text,false);
                editBuilder.insert(position, debugStatement);
                break;
            }

            if (semicolonIndex !== -1) {
                const position = new vscode.Position(currentLine, semicolonIndex + 1);
                const debugStatement = printDebugStatement(indentation,lineNumber,hierarchy,text,false);
                editBuilder.insert(position, debugStatement);
                break;
            }
            currentLine++;
        }
    });
}

const removeAllSystemDebug = async (editor) =>{

    let start = 0, end = editor.document.lineCount - 1;
    
    let deleteLines = [];
    for (let i = start; i <= end; i++) {
        const line = editor.document.lineAt(i);
        const lineText = line.text.trim();
        if (lineText.startsWith("System.debug(") && lineText.endsWith(");")) {
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

const removeCommentsAndFormatSOQL = (soqlText) => {
    const lines = soqlText.split('\n');
    let formattedSOQL = '';
  
    for (const line of lines) {
      const cleanedLine = line.replace(/\/\/.*/, '');
  
      const trimmedLine = cleanedLine.trim();
  
      if (trimmedLine) {
        formattedSOQL += trimmedLine + ' ';
      }
    }
    formattedSOQL= '[' + formattedSOQL.trim() + ']';
    return formattedSOQL;
}

const getFileName = (fileName) => {
    if (!fileName.endsWith('cls')) {
        TSD_ERRORS.showNoApexFileMessage();
    }
    const parts = fileName.split('\\');
    const fileNameWithExtension = parts[parts.length - 1];
    const className = fileNameWithExtension.slice(0, -4);

    return className;
}

const printDebugStatement = (indentation, lineNumber, hierarchy, text, isSQL) => {
    let returnString = '';
    
    if(isSQL){
        returnString =  `${indentation}System.debug('###########@@ LINE ${lineNumber + 1} -> ${hierarchy} -> SOQL Query @@###########');\n${indentation}System.debug(${text});\n`;
    }else{
        returnString = `\n${indentation}System.debug('###########@@ LINE ${lineNumber + 1} -> ${hierarchy} -> ${text}  @@###########');\n${indentation}System.debug(${text});`;
    }
    
    return returnString;
}

module.exports = {
    getHeirarchy,
    insertSystemDebug,
    removeAllSystemDebug,
    removeCommentsAndFormatSOQL
}