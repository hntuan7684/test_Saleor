Feature: Pricing System
  As a customer
  I want to see accurate pricing based on my login status and order details
  So that I can make informed purchasing decisions

  Background:
    Given I am on the product detail page

  @PR001 @pricing @guest-user
  Scenario: Display Price A for non-logged users
    Given I am not logged in
    When I view the product pricing
    Then I should see Price A category pricing
    And the pricing should be based on quantity tiers

  @PR002 @pricing @logged-user
  Scenario: Display Price B for logged users
    Given I am logged in
    When I view the product pricing
    Then I should see Price B category pricing
    And the pricing should be more favorable than Price A

  @PR003 @pricing @quantity-tiers
  Scenario: Different prices based on quantity
    When I change the quantity to different tiers
    Then the price should update accordingly
    And the pricing should follow the tier structure

  @PR004 @pricing @screen-printing
  Scenario: Calculate screen printing costs by colors
    When I select 3 colors for front printing
    And I select 1 color for back printing
    Then the total printing cost should be $1.55
    And the cost should be itemized by area

  @PR005 @pricing @screen-printing
  Scenario: Calculate printing costs for different areas
    When I select printing for chest area
    And I select printing for back area
    Then the costs should be calculated separately
    And the total should be the sum of all areas

  @PR006 @pricing @coupon
  Scenario: Apply coupon discount
    When I enter a valid coupon code
    Then the discount should be applied
    And the final price should reflect the discount percentage

  @PR007 @pricing @coupon
  Scenario: Handle invalid coupon codes
    When I enter an invalid coupon code
    Then I should see an error message
    And the price should remain unchanged

  @PR008 @pricing @coupon
  Scenario: Apply multiple coupons
    When I apply multiple valid coupons
    Then the system should handle the combination correctly
    And the total discount should be calculated properly

  @PR009 @pricing @real-time
  Scenario: Real-time price updates
    When I change product options
    Then the price should update in real-time
    And all calculations should be accurate

  @PR010 @pricing @comparison
  Scenario: Compare prices between logged and non-logged states
    Given I am not logged in
    When I note the current price
    And I log in
    Then I should see a different (better) price
    And the difference should be clearly visible 