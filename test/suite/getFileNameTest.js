const assert = require('assert');
const { getFileName } = require('../../helper');

const getFileNameTestSuite = () => {

    test('getFileNameTest => should return correct file name without .cls extension', async () => {
        const fileName = 'TestClass.cls';
        const result = getFileName(fileName);
        assert.strictEqual(result, 'TestClass');
    });

    test('getFileNameTest => should throw an error when file extension is not .cls', async () => {
        const fileName = 'NotAClass.txt';
        try {
            getFileName(fileName);
            
            assert.fail('Expected an error to be thrown');
        } catch (error) {
            
            assert.strictEqual(error.message, 'TSD: No apex file!');
        }
    });
}

module.exports = {
	getFileNameTestSuite
}