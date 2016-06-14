Feature: Member enters a Pool
  As a User
  I want to join existing Pools

  Scenario: Member sees a list of available Pools
    Given I have signed in
     When I go to the insurance Pools list page
     Then I should see a list of available Pools

  Scenario: Member joins a Pool
    Given I am in the insurance Pools list page
     When I click "Enter" on a Pool
     And I accept the Pool terms
     Then I should see a success notification
     And the selected Pool should not be available on the Pools list
