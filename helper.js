const isApex = (fileNameArray) => {
    const fileExt = fileNameArray[fileNameArray.length - 1].split('.');
    if (fileExt[fileExt.length - 1] !== 'cls') {
        return false;
    }
        return true;
}


module.exports = {
    isApex
}