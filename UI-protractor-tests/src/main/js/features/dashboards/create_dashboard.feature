Feature: Create Dashboard

  As a software project stakeholder
  I want to ensure that I am able to create a new dashboard for my project
  In order to view project metrics.

  @issues:TEART-2801
  Scenario: User creates a new team dashboard
    Given I am an authorized project stakeholder
    And I am on the Hygieia home screen
    When I define a new team dashboard named 'DummyTeamDashboard'
    And I create the dashboard
    Then the current dashboard header should read 'DummyTeamDashboard'

  @issues:TEART-2801
  Scenario: User creates a new product dashboard
    Given I am an authorized project stakeholder
    And I am on the Hygieia home screen
    When I define a new product dashboard named 'DummyProdDashboard'
    And I create the dashboard
    Then the current dashboard header should read 'DummyProdDashboard'

  @issues:TEART-2801
  Scenario: User creates a new dashboard with existing dashboard title
    Given I am an authorized project stakeholder
    And I am on the Hygieia home screen
    When I define a new dashboard named 'DummyTeamDashboard'
    And I create the dashboard
    Then I should see an error for creating dashboard with existing title

  @issues:TEART-2801
  Scenario: User creates a new dashboard with special characters in dashboard title
    Given I am an authorized project stakeholder
    And I am on the Hygieia home screen
    When I define a new dashboard named 'DummyTeamDashboard@#$%'
    And I create the dashboard
    Then I should see an error for creating dashboard with special characters in title

  @issues:TEART-2801
  Scenario: User creates a new dashboard with less than 6 characters in dashboard title
    Given I am an authorized project stakeholder
    And I am on the Hygieia home screen
    When I define a new dashboard named 'Dummy'
    And I create the dashboard
    Then I should see an error for creating dashboard with less than 6 characters in title

  @issues:TEART-2801
  Scenario: User creates a new dashboard without dashboard title
    Given I am an authorized project stakeholder
    And I am on the Hygieia home screen
    When I define a new dashboard named 'DummyDashboard'
    And I create the dashboard
    Then I should see an error for creating dashboard without dashboard title

  @issues:TEART-2801
  Scenario: User creates a new dashboard without application name
    Given I am an authorized project stakeholder
    And I am on the Hygieia home screen
    When I define a new dashboard named 'DummyDashboard'
    And I create the dashboard
    Then I should see an error for creating dashboard without application name

  @issues:TEART-2801
  Scenario: User creates a new dashboard without selecting a templates
    Given I am an authorized project stakeholder
    And I am on the Hygieia home screen
    When I define a new dashboard named 'DummyDashboard'
    And I create the dashboard
    Then I should see an error for creating dashboard without selecting a templates