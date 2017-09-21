Feature: CodeRepo Widget

  As a software project stakeholder
  I want to ensure that I am able to build widget for my project
  In order to view project metrics.

  @issues:TEART-2802
  Scenario: User configures a code repo widget
    Given I am an authorized project stakeholder
    And I am on the Hygieia home screen
    When I select a team dashboard named 'DummyTeamDashboard'
    And I click on the settings button for build widget
    And I enter a Build Job
    And I enter alert takeover criteria
    And I click on Save button
    Then the build widget should display the right information

  @issues:TEART-2802
  Scenario: Verify the search functionality on the text box for Build Job
    Given I am an authorized project stakeholder
    And I am on the Hygieia home screen
    When I select a team dashboard named 'DummyTeamDashboard'
    And I click on the settings button for feature widget
    And I type a search string for Build Job
    Then all the matching build jobs with the search string should be displayed

  @issues:TEART-2802
  Scenario: User edits the configuration of a build widget
    Given I am an authorized project stakeholder
    And I am on the Hygieia home screen
    When I select a team dashboard named 'DummyTeamDashboard'
    And I click on the settings button for build widget
    And I change Build Job
    And I click on Save button
    Then the feature widget should display the changes

  @issues:TEART-2802
  Scenario: User cancels the configuration of a build widget
    Given I am an authorized project stakeholder
    And I am on the Hygieia home screen
    When I select a team dashboard named 'DummyTeamDashboard'
    And I click on the settings button for build widget
    And I change Buid Job
    And I click on Cancel button
    Then the feature widget should display the same configuration

  @issues:TEART-2802
  Scenario: Verify the build widget turns red when there are more than 5 consecutive build failures
    Given I am an authorized project stakeholder
    And I am on the Hygieia home screen
    When I select a team dashboard named 'DummyTeamDashboard'
    And I click on the settings button for feature widget
    And I enter a build job which failed for the last 5 times
    And I click on Save button
    Then build widget should be displayed in red color