const getHeirarchy = (fullText, lineNumber, document) => {
    // Split the file path using the backslash '\' as the delimiter
    const parts = document.fileName.split('\\');

    // Get the last part of the split, which will be the file name with the .cls extension
    const fileNameWithExtension = parts[parts.length - 1];

    // Remove the .cls extension from the file name
    const className = fileNameWithExtension.slice(0, -4);

    const file = document.getText();

    return `${className} -> `
}


module.exports = {
    getHeirarchy,
}