Feature: Shipping Management
  As a customer
  I want to upload shipping lists for multiple locations
  So that I can efficiently manage bulk orders to different addresses

  Background:
    Given I am on the checkout page

  @SM001 @file-upload @csv
  Scenario: Upload CSV shipping list
    When I upload a valid CSV shipping list
    Then the file should be accepted
    And the shipping addresses should be processed

  @SM002 @file-upload @validation
  Scenario: Validate CSV file format
    When I upload an invalid CSV file
    Then I should see an error message
    And the file should be rejected

  @SM003 @file-upload @template
  Scenario: Download CSV template
    When I click on the download template link
    Then a CSV template should be downloaded
    And the template should contain the required columns

  @SM004 @address @validation
  Scenario: Validate shipping addresses
    When I upload a CSV with invalid addresses
    Then I should see validation errors
    And the invalid addresses should be highlighted

  @SM005 @quantity @validation
  Scenario: Validate quantities per address
    When I upload a CSV with invalid quantities
    Then I should see quantity validation errors
    And the system should prevent order placement

  @SM006 @order-splitting @automatic
  Scenario: Automatically split orders by shipping address
    When I upload a valid shipping list
    Then the order should be split by address
    And each address should have its own sub-order

  @SM007 @shipping-cost @calculation
  Scenario: Calculate shipping costs per address
    When I upload a shipping list with multiple addresses
    Then shipping costs should be calculated per address
    And the total should include all shipping costs

  @SM008 @shipping-cost @display
  Scenario: Display shipping costs breakdown
    When I view the shipping cost details
    Then I should see costs for each address
    And the breakdown should be expandable

  @SM009 @order-management @sub-orders
  Scenario: Create sub-orders for each shipping address
    When the shipping list is processed
    Then separate orders should be created for each address
    And each sub-order should have its own tracking

  @SM010 @inventory @management
  Scenario: Handle inventory for split orders
    When I place an order with multiple shipping addresses
    Then inventory should be checked for the total quantity
    And backorder warnings should be shown if needed

  @SM011 @user-interface @upload
  Scenario: User-friendly file upload interface
    When I access the shipping list upload feature
    Then the interface should be intuitive
    And drag-and-drop should be supported

  @SM012 @preview @confirmation
  Scenario: Preview shipping information before order
    When I upload a shipping list
    Then I should see a preview of all addresses
    And I should be able to edit or remove addresses

  @SM013 @error-handling @file-issues
  Scenario: Handle file upload errors gracefully
    When I encounter a file upload error
    Then I should see a clear error message
    And I should be guided to resolve the issue

  @SM014 @bulk-printing @optimization
  Scenario: Optimize for bulk printing efficiency
    When I place an order with multiple addresses
    Then the system should group similar designs
    And bulk printing should be optimized 