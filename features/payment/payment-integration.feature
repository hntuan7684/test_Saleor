Feature: Payment Integration
  As a customer
  I want to complete payments securely through Stripe
  So that I can purchase products with confidence

  Background:
    Given I am on the checkout page

  @PI001 @payment @stripe-integration
  Scenario: Complete payment with Stripe
    When I enter valid payment information
    And I submit the payment
    Then the payment should be processed through Stripe
    And I should receive a payment confirmation

  @PI002 @payment @validation
  Scenario: Validate payment information
    When I enter invalid payment information
    Then I should see validation errors
    And the payment should not be processed

  @PI003 @payment @card-validation
  Scenario: Validate credit card details
    When I enter an invalid credit card number
    Then I should see a card validation error
    And the form should highlight the invalid field

  @PI004 @payment @expiry-validation
  Scenario: Validate card expiry date
    When I enter an expired card
    Then I should see an expiry date error
    And the payment should be rejected

  @PI005 @payment @cvv-validation
  Scenario: Validate CVV code
    When I enter an invalid CVV
    Then I should see a CVV validation error
    And the payment should not proceed

  @PI006 @payment @success-flow
  Scenario: Successful payment flow
    When I complete a successful payment
    Then I should see a success message
    And I should be redirected to the order confirmation page
    And I should receive an order confirmation email

  @PI007 @payment @error-handling
  Scenario: Handle payment processing errors
    When a payment processing error occurs
    Then I should see a user-friendly error message
    And I should be able to retry the payment

  @PI008 @payment @security
  Scenario: Secure payment processing
    When I enter payment information
    Then the data should be encrypted
    And sensitive information should not be stored locally

  @PI009 @payment @amount-validation
  Scenario: Validate payment amount
    When I attempt to pay an incorrect amount
    Then I should see an amount validation error
    And the correct amount should be displayed

  @PI010 @payment @currency-handling
  Scenario: Handle currency conversion
    When I pay in a different currency
    Then the currency should be converted correctly
    And the exchange rate should be clearly displayed

  @PI011 @payment @refund-process
  Scenario: Process payment refunds
    When I request a refund
    Then the refund should be processed through Stripe
    And I should receive a refund confirmation

  @PI012 @payment @webhook-handling
  Scenario: Handle Stripe webhooks
    When Stripe sends a webhook notification
    Then the order status should be updated accordingly
    And the customer should be notified

  @PI013 @payment @testing-mode
  Scenario: Use Stripe test mode
    When I use test payment credentials
    Then the payment should be processed in test mode
    And no real charges should be made

  @PI014 @payment @mobile-responsive
  Scenario: Mobile-responsive payment form
    When I access the payment form on mobile
    Then the form should be properly displayed
    And all fields should be easily accessible 