public without sharing class TestClass {
  
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
    response.setStatusCode(200);
    return response;
  }
}