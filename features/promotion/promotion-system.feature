Feature: Promotion System
  As a customer
  I want to apply promotions and discounts to my orders
  So that I can save money on my purchases

  Background:
    Given I am on the checkout page

  @PS001 @promotion @code-application
  Scenario: Apply valid promotion code
    When I enter a valid promotion code
    And I apply the promotion
    Then the discount should be applied to my order
    And the final price should reflect the discount

  @PS002 @promotion @validation
  Scenario: Validate promotion code format
    When I enter an invalid promotion code format
    Then I should see a format validation error
    And the promotion should not be applied

  @PS003 @promotion @expiration
  Scenario: Handle expired promotion codes
    When I enter an expired promotion code
    Then I should see an expiration error message
    And the promotion should be rejected

  @PS004 @promotion @usage-limits
  Scenario: Respect promotion usage limits
    When I try to use a promotion that has reached its usage limit
    Then I should see a usage limit error
    And the promotion should not be applied

  @PS005 @promotion @minimum-order
  Scenario: Enforce minimum order requirements for promotions
    When I try to apply a promotion to an order below the minimum
    Then I should see a minimum order requirement message
    And the promotion should not be applied

  @PS006 @promotion @percentage-discount
  Scenario: Apply percentage-based discount
    When I apply a percentage-based promotion
    Then the discount should be calculated as a percentage
    And the calculation should be accurate

  @PS007 @promotion @fixed-discount
  Scenario: Apply fixed amount discount
    When I apply a fixed amount promotion
    Then the discount should be a fixed amount
    And the amount should be deducted from the total

  @PS008 @promotion @multiple-promotions
  Scenario: Handle multiple promotions
    When I apply multiple valid promotions
    Then the system should handle the combination correctly
    And the total discount should be calculated properly

  @PS009 @promotion @conflict-resolution
  Scenario: Resolve promotion conflicts
    When I apply conflicting promotions
    Then the system should resolve conflicts appropriately
    And I should be informed about the resolution

  @PS010 @promotion @product-specific
  Scenario: Apply product-specific promotions
    When I apply a promotion for specific products
    Then the discount should only apply to eligible products
    And other products should remain at full price

  @PS011 @promotion @user-specific
  Scenario: Apply user-specific promotions
    When I apply a promotion that is specific to my user account
    Then the promotion should be validated against my account
    And the discount should be applied if eligible

  @PS012 @promotion @removal
  Scenario: Remove applied promotion
    When I remove an applied promotion
    Then the discount should be removed
    And the total price should be recalculated

  @PS013 @promotion @display
  Scenario: Display promotion information clearly
    When I apply a promotion
    Then the promotion details should be clearly displayed
    And the savings amount should be visible

  @PS014 @promotion @history
  Scenario: Track promotion usage history
    When I use a promotion
    Then the usage should be tracked in my account
    And I should be able to view my promotion history

  @PS015 @promotion @auto-apply
  Scenario: Auto-apply eligible promotions
    When I have eligible promotions for my order
    Then the system should suggest applicable promotions
    And I should be able to apply them with one click 