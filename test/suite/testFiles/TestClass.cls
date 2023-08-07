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
}