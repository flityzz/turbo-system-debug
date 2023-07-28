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

const getFileName = (fileName) => {

    const parts = fileName.split('\\');
    // Get the last part of the split, which will be the file name with the .cls extension
    const fileNameWithExtension = parts[parts.length - 1];
    
    const className = fileNameWithExtension.slice(0, -4);

    return className;
}



module.exports = {
    getHeirarchy
}