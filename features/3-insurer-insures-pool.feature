Feature: Insurer insures Pool
  As a User
  I want to insure existing Pools

  Scenario: Insurer insures Pool
    Given I am in the insurance Pools list page
     When I click "Insure" on a Pool
     And I fill in the insurance terms
     And I click the "Insure" button
     Then I should see a success notification
     And the selected Pool on the list should be updated with the new premium
