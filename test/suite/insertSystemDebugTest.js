const assert = require('assert');
const vscode = require('vscode');
const Diff = require('diff');

const { insertSystemDebug, getHeirarchy, removeCommentsAndFormatSOQL} = require('../../helper');

const FILE_PATH = 'D:\\Projects\\Turbo system debug\\turbo-system-debug\\test\\suite\\testFiles\\TestClass.cls';

const insertSystemDebugSuite = () => {
    
    test('insertSystemDebugTest => basic input', async () => {
		
		const fullText = '// Test code here'
		const lineNumber = 8;
		
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
        }
      
        @IsTest
        public static void testMethodIsTestannotation() {
            // Test code here
            System.debug('###########@@ LINE 9 -> TestClass -> testMethodIsTestannotation() -> // Test code here @@###########');
            System.debug(// Test code here);
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

        @isTest
        static void populateCourses_sets3Courses() {
            // GIVEN
            BeforeRenderHookController controller = new BeforeRenderHookController();

            // WHEN
            controller.populateCourses();

            // THEN
            List<String> expectedCourses = new List<String>{
            'Irrigation Systems',
            'Soils',
            'Organic Crops'
            };
            System.assertEquals(
            expectedCourses,
            controller.courses,
            'Courses where not correctly populated'
            );
        }

        global HTTPResponse respond(HTTPRequest request) {
          // Create a fake response
          HttpResponse response = new HttpResponse();
          response.setHeader('Content-Type', 'application/json');
          response.setBody(
            '{ "animal": { "id": "5", "name": "Tiger",  "eats": "meat", "says": "roar" }}'
          );
          response.setStatusCode(200);
          return response;
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

    test('insertSystemDebugTest => testSelectParamLine', async () => {
		
      const fullText = 'annualRevenue'
      const lineNumber = 26;
      
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
          System.debug('###########@@ LINE 27 -> TestClass -> testSelectParamLine() -> annualRevenue @@###########');
          System.debug(annualRevenue);
          return [SELECT Name FROM Account WHERE AnnualRevenue >= :annualRevenue];
        }
      
        @isTest
        static void populateCourses_sets3Courses() {
          // GIVEN
          BeforeRenderHookController controller = new BeforeRenderHookController();
      
          // WHEN
          controller.populateCourses();
      
          // THEN
          List<String> expectedCourses = new List<String>{
            'Irrigation Systems',
            'Soils',
            'Organic Crops'
          };
          System.assertEquals(
            expectedCourses,
            controller.courses,
            'Courses where not correctly populated'
          );
        }

        global HTTPResponse respond(HTTPRequest request) {
          // Create a fake response
          HttpResponse response = new HttpResponse();
          response.setHeader('Content-Type', 'application/json');
          response.setBody(
            '{ "animal": { "id": "5", "name": "Tiger",  "eats": "meat", "says": "roar" }}'
          );
          response.setStatusCode(200);
          return response;
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

    test('insertSystemDebugTest => test JSON ', async () => {
		
      const fullText = 'response'
      const lineNumber = 55;
      
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
      
        @isTest
        static void populateCourses_sets3Courses() {
          // GIVEN
          BeforeRenderHookController controller = new BeforeRenderHookController();
      
          // WHEN
          controller.populateCourses();
      
          // THEN
          List<String> expectedCourses = new List<String>{
            'Irrigation Systems',
            'Soils',
            'Organic Crops'
          };
          System.assertEquals(
            expectedCourses,
            controller.courses,
            'Courses where not correctly populated'
          );
        }
        
        global HTTPResponse respond(HTTPRequest request) {
          // Create a fake response
          HttpResponse response = new HttpResponse();
          response.setHeader('Content-Type', 'application/json');
          response.setBody(
            '{ "animal": { "id": "5", "name": "Tiger",  "eats": "meat", "says": "roar" }}'
          );
          System.debug('###########@@ LINE 56 -> TestClass -> respond() -> response  @@###########');
          System.debug(response);
          response.setStatusCode(200);
          return response;
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

    test('insertSystemDebugTest => basic new List<String>', async () => {
		
		const fullText = 'expectedCourses'
		const lineNumber = 39;
		
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
        
        @isTest
        static void populateCourses_sets3Courses() {
          // GIVEN
          BeforeRenderHookController controller = new BeforeRenderHookController();
      
          // WHEN
          controller.populateCourses();
      
          // THEN
          List<String> expectedCourses = new List<String>{
            'Irrigation Systems',
            'Soils',
            'Organic Crops'
          };
          System.debug('###########@@ LINE 40 -> TestClass -> populateCourses_sets3Courses() -> expectedCourses  @@###########');
          System.debug(expectedCourses);
          System.assertEquals(
            expectedCourses,
            controller.courses,
            'Courses where not correctly populated'
          );
        }

        global HTTPResponse respond(HTTPRequest request) {
          // Create a fake response
          HttpResponse response = new HttpResponse();
          response.setHeader('Content-Type', 'application/json');
          response.setBody(
            '{ "animal": { "id": "5", "name": "Tiger",  "eats": "meat", "says": "roar" }}'
          );
          response.setStatusCode(200);
          return response;
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

    test('insertSystemDebugTest => SQL Insert', async () => {
		
		let fullText = `return [
            // Return whatever the component needs
            SELECT Name
            FROM Account
            WHERE NumberOfEmployees >= :numberOfEmployees
          ];`

    const sqlRegex = /\[\s*([\s\S]*?)\s*\]/;
    const match = fullText.match(sqlRegex);
    
    if(match){
        const sqlQuery = match[1].trim();
        fullText = removeCommentsAndFormatSOQL(sqlQuery);
    }

		const lineNumber = 13;
		
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
        }
      
        @IsTest
        public static void testMethodIsTestannotation() {
            // Test code here
        }
      
        @IsTest
        public static List<Account> testMethodSQL() {
          System.debug('###########@@ LINE 14 -> TestClass -> testMethodSQL() -> [SELECT Name FROM Account WHERE NumberOfEmployees >= :numberOfEmployees] @@###########');
          System.debug([SELECT Name FROM Account WHERE NumberOfEmployees >= :numberOfEmployees]);
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

        @isTest
        static void populateCourses_sets3Courses() {
        // GIVEN
        BeforeRenderHookController controller = new BeforeRenderHookController();

        // WHEN
        controller.populateCourses();

        // THEN
        List<String> expectedCourses = new List<String>{
            'Irrigation Systems',
            'Soils',
            'Organic Crops'
        };
        System.assertEquals(
            expectedCourses,
            controller.courses,
            'Courses where not correctly populated'
        );
        }

        global HTTPResponse respond(HTTPRequest request) {
          // Create a fake response
          HttpResponse response = new HttpResponse();
          response.setHeader('Content-Type', 'application/json');
          response.setBody(
            '{ "animal": { "id": "5", "name": "Tiger",  "eats": "meat", "says": "roar" }}'
          );
          response.setStatusCode(200);
          return response;
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