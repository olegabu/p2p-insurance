Feature: oracle informs insurance event
  As an Oracle
  I want to inform about insurance events

  Scenario: Oracle informs about an insurance event
    Given I am in the Oracle demo page
     When I click the "Trigger" button
     And I fill in the transfer details
     And I select a trigger from the Trigger dropdown list
     Then I should see a success notification
     And the chaincode should mark all the pools that match the Trigger them as "needed to pay their members"
