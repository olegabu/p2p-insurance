Feature: Oracle informs of money transfer
  As an Oracle
  I want to inform about money transfers (for a premium payment or a claim payout to member)

  Scenario: Oracle informs about money transfer
    Given I am in the Oracle demo page
     When I click the "Transfer" button
     And I fill in the transfer details
     Then I should see a success notification
     And the chaincode should find the pool by id and verify parties of the transfer
