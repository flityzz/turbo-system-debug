const assert = require('assert');
const vscode = require('vscode');
const Diff = require('diff');

const { insertSystemDebug, getHeirarchy} = require('../../helper');

const FILE_PATH = 'D:\\Projects\\Turbo system debug\\turbo-system-debug\\test\\suite\\testFiles\\TestClass.cls';

const insertSystemDebugSuite = () => {
    
    test('insertSystemDebugTest => basic input', async () => {
		
		const fullText = 'here'
		const lineNumber = 3;
		
		const uri = vscode.Uri.file(FILE_PATH);
    	const document = await vscode.workspace.openTextDocument(uri);

        await vscode.window.showTextDocument(document);
        //get hierarchy first
		const heirarchy = getHeirarchy(fullText, lineNumber, document);

        insertSystemDebug(lineNumber, fullText, heirarchy);
        
        await document.save();

        const updatedContent = document.getText()

        //this is the class after the system debugs statements
        const classAfterInsert = `public without sharing class TestClass {
  
            public void testMethod() {
              // Some code here
              System.debug('###########@@ LINE 4 -> TestClass -> testMethod() -> here @@###########');
              System.debug(here);
            }
          
            @IsTest
            public static void testMethodIsTestannotation() {
                // Test code here
            }
          
            @IsTest
            public static List<Account> testMethodSQL() {
              return [
                // Return whatever the component needs
                SELECT Name
                FROM Account
                WHERE NumberOfEmployees >= :numberOfEmployees
              ];
            }
          
            @AuraEnabled(cacheable=true)
            public static void testMethodAuraEnabled() {
              // Test code here
            }
            
            public static List<Account> testSelectParamLine(Decimal annualRevenue) {
              return [SELECT Name FROM Account WHERE AnnualRevenue >= :annualRevenue];
            }
          }`;
        
        const differences = Diff.diffTrimmedLines(classAfterInsert, updatedContent, {
            ignoreCase: true,
            newlineIsToken: true
        });

        
        await vscode.commands.executeCommand('undo');
        await document.save();

        assert.strictEqual(differences.length, 1);
        
	});

}

module.exports ={
    insertSystemDebugSuite
}