Feature: Order Quantity Validation
  As a customer
  I want the system to enforce minimum order quantities
  So that bulk orders are properly managed

  Background:
    Given I am on the product detail page

  @OQ001 @validation @minimum-order
  Scenario: Prevent orders less than 500 shirts
    When I try to add less than 500 shirts to cart
    Then I should see a minimum order message
    And I should be redirected to the support form

  @OQ002 @validation @minimum-order
  Scenario: Allow orders of exactly 500 shirts
    When I add exactly 500 shirts to cart
    Then the order should be accepted
    And I should be able to proceed to checkout

  @OQ003 @validation @minimum-order
  Scenario: Allow orders greater than 500 shirts
    When I add more than 500 shirts to cart
    Then the order should be accepted
    And I should be able to proceed to checkout

  @OQ004 @permission @small-order
  Scenario: Display permission note for small orders
    When I view the product page
    Then I should see a note about minimum 500 orders
    And the note should mention contacting support for smaller orders

  @OQ005 @permission @keycloak
  Scenario: Allow small orders with special permission
    Given I am logged in with special permission
    When I try to add less than 500 shirts to cart
    Then the order should be accepted
    And I should see a special permission indicator

  @OQ006 @validation @error-handling
  Scenario: Clear error message for quantity validation
    When I enter an invalid quantity
    Then I should see a clear error message
    And the error should explain the minimum requirement

  @OQ007 @navigation @support-redirect
  Scenario: Redirect to support form for small orders
    When I click on the support link for small orders
    Then I should be redirected to the support form
    And the form should be pre-filled with order inquiry

  @OQ008 @ui @user-experience
  Scenario: User-friendly interface for quantity restrictions
    When I view the quantity input field
    Then I should see helpful tooltips about minimum orders
    And the interface should guide me to the correct quantity 