Feature: Support Form
  As a user
  I want to submit a support request
  So that I can get help from the support team

  Background:
    Given I am on the support form page

  @SP001 @layout
  Scenario: Check alignment of input fields
    Then all input fields should be visible and properly aligned
    And no input fields should overlap each other
    And all fields should be contained within the form boundaries

  @SP002 @validation @mandatory
  Scenario: Send button is disabled until mandatory fields are filled
    When I try to submit the form without filling mandatory fields
    Then I should see error messages for mandatory fields
    When I fill all mandatory fields
    And I submit the form
    Then the form should be submitted successfully

  @SP003 @responsive
  Scenario: Check responsive layout on different screen sizes
    When I view the form on mobile screen
    Then the form should be properly displayed on mobile
    When I view the form on desktop screen
    Then the form should be properly displayed on desktop

  @SP005 @navigation
  Scenario: Tab navigation works properly
    When I click on the first name field
    Then I should be able to navigate through all fields using Tab key

  @SP007 @happy-path
  Scenario: Submit form with all valid data
    When I fill the form with complete valid data
    And I submit the form
    Then I should see "Support request created successfully" message

  @SP008 @validation @mandatory
  Scenario: Submit form with only mandatory fields filled
    When I fill only mandatory fields
    And I submit the form
    Then I should see error messages for missing required fields
    And the form should not be submitted

  @SP009 @validation @mandatory
  Scenario: Submit form with all fields empty
    When I submit the form without filling any fields
    Then I should see error messages for all required fields
    And the form should not be submitted

  @SP010 @validation @mandatory
  Scenario: Submit form with first name empty
    When I fill all fields except first name
    And I submit the form
    Then I should see "First name is required" message

  @SP011 @validation @mandatory
  Scenario: Submit form with last name empty
    When I fill all fields except last name
    And I submit the form
    Then I should see "Last name is required" message

  @SP012 @validation @mandatory
  Scenario: Submit form with details empty
    When I fill all fields except details
    And I submit the form
    Then I should see "Details are required" message

  @SP013 @validation @mandatory
  Scenario: Submit form with email empty
    When I fill all fields except email
    And I submit the form
    Then I should see "Email is required" message

  @SP016 @validation @boundary
  Scenario: First name with maximum length boundary
    When I fill first name with maximum allowed length
    And I submit the form
    Then the form should be submitted successfully

  @SP017 @validation @boundary
  Scenario: First name exceeding maximum length
    When I fill first name exceeding maximum allowed length
    And I submit the form
    Then I should see "Error creating support request: value too long for type character varying(255)" message

  @SP019 @validation @boundary
  Scenario: Last name with maximum length boundary
    When I fill last name with maximum allowed length
    And I submit the form
    Then the form should be submitted successfully

  @SP020 @validation @boundary
  Scenario: Last name exceeding maximum length
    When I fill last name exceeding maximum allowed length
    And I submit the form
    Then I should see "Error creating support request: value too long for type character varying(255)" message

  @SP021 @validation @email
  Scenario: Valid email format
    When I fill the form with valid email format
    And I submit the form
    Then the form should be submitted successfully

  @SP022 @validation @email
  Scenario: Invalid email format
    When I fill the form with invalid email format
    And I submit the form
    Then I should see "Invalid email address" message

  @SP023 @validation @email
  Scenario: Email with leading and trailing spaces
    When I fill email with leading and trailing spaces
    And I submit the form
    Then the form should be submitted successfully

  @SP024 @validation @email
  Scenario: Email with invalid characters in domain
    When I fill email with invalid characters in domain
    And I submit the form
    Then I should see "Invalid email address" message

  @SP025 @validation @phone
  Scenario: Valid phone number format
    When I fill the form with valid phone number format
    And I submit the form
    Then the form should be submitted successfully

  @SP026 @validation @phone
  Scenario: Phone number with letters
    When I fill phone number with letters
    And I submit the form
    Then I should see "Please enter a valid phone number" message

  @SP027 @validation @phone
  Scenario: Phone number with special characters
    When I fill phone number with special characters
    And I submit the form
    Then I should see "Please enter a valid phone number" message

  @SP028 @validation @phone
  Scenario: Phone number with incorrect length
    When I fill phone number with incorrect length
    And I submit the form
    Then I should see "Please enter a valid phone number" message

  @SP030 @validation @company
  Scenario: Company field accepts alphanumeric and common symbols
    When I fill company field with alphanumeric and common symbols
    And I submit the form
    Then the form should be submitted successfully

  @SP032 @security
  Scenario: HTML/JS injection attempt
    When I fill all fields with HTML/JS injection attempts
    And I submit the form
    Then no JavaScript alerts should be triggered
    And the form should handle injection attempts safely

  @SP033 @security
  Scenario: SQL injection attempt
    When I fill all fields with SQL injection attempts
    And I submit the form
    Then no database errors should be exposed
    And the form should handle injection attempts safely 