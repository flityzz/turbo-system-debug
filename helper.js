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

const getLineNumberAndIndentToPrint = (fullText, lineNumber, document) => {
    const firstCharPosition = fullText.search(/\S/);
    let indent = firstCharPosition;

    let trimedfullText = fullText.trim()
    if (trimedfullText.endsWith(':')) {
        indent += 4
    }

    if (firstCharPosition === 0) {
        return { correctedLineNumber: lineNumber, indent: indent }
    } else {
        let tempLineNumber = lineNumber
        let firstCharPosition = fullText.search(/\S/);
        while (firstCharPosition !== 0) {
            tempLineNumber--
            if (firstCharPosition === 0) {
                break
            }
            let text = document.lineAt(tempLineNumber).text
            let trimedText = text.trim()

            if (trimedText.endsWith(':')) {
                break
            }
            firstCharPosition = text.search(/\S/);
        }
        let startingBrackets = ['[', '{', '(']
        let endingBrackets = [']', '}', ')']
        let bracketsStack = []

        while (tempLineNumber !== lineNumber) {
            tempLineNumber++
            let text = document.lineAt(tempLineNumber).text
            let trimedText = [...text.trim()]
            modifyBracketsStack(trimedText, startingBrackets, bracketsStack, endingBrackets)
        }
        while (bracketsStack.length !== 0) {
            tempLineNumber++
            let text = document.lineAt(tempLineNumber).text
            let trimedText = [...text.trim()]
            modifyBracketsStack(trimedText, startingBrackets, bracketsStack, endingBrackets)
        }

        return { correctedLineNumber: tempLineNumber, indent: indent }
    }
}

const modifyBracketsStack = (trimedText, startingBrackets, bracketsStack, endingBrackets) => {
    trimedText.forEach(c => {
        if (startingBrackets.includes(c)) {
            bracketsStack.push(c)
        } else if (endingBrackets.includes(c)) {
            // check if corresponding bracket is in the stack
            if (c === ']') {
                // check if the last element is "[", if yes pop it
                if (bracketsStack[bracketsStack.length - 1] === '[') {
                    bracketsStack.pop()
                }
            } else if (c === '}') {
                if (bracketsStack[bracketsStack.length - 1] === '{') {
                    bracketsStack.pop()
                }
            } else if (c === ')') {
                if (bracketsStack[bracketsStack.length - 1] === '(') {
                    bracketsStack.pop()
                }
            }
        }
    })
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
    getLineNumberAndIndentToPrint
}