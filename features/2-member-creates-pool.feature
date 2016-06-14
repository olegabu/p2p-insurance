Feature: Member creates a Pool
  As a User
  I want to create new Pools

  Scenario: Member creates a new Pool
    Given I am in the insurance Pools list page
     When I click the "Create Pool" button
     And I fill in the new Pool details
     And I select a trigger from the Trigger dropdown list
     And I click the "Create" button
     Then I should see a success notification
     And the new Pool should be available on the Pools list for other Members
