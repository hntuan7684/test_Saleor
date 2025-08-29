Feature: Design Tool
  As a customer
  I want to customize and manage my designs effectively
  So that I can create the perfect product for my needs

  Background:
    Given I am on the design tool page

  @DT001 @art-depot @logged-user
  Scenario: Display art depot for logged users
    Given I am logged in
    When I access the design tool
    Then I should see the art depot section
    And I should see my previously used designs

  @DT002 @art-depot @guest-user
  Scenario: Hide art depot for non-logged users
    Given I am not logged in
    When I access the design tool
    Then I should not see the art depot section
    And I should see a message to log in for access

  @DT003 @art-depot @management
  Scenario: Save design to art depot
    When I create a new design
    And I save the design
    Then the design should be saved to my art depot
    And I should see a confirmation message

  @DT004 @product-change @selection
  Scenario: Change products in design tool
    When I select a different product type
    Then the design canvas should update
    And the design should adapt to the new product

  @DT005 @product-change @compatibility
  Scenario: Maintain design compatibility when changing products
    When I change from t-shirt to hoodie
    Then my existing design should be preserved
    And the design should be properly positioned

  @DT006 @undo-redo @functionality
  Scenario: Undo design changes
    When I make multiple design changes
    And I click the undo button
    Then the last change should be reverted
    And the design should return to the previous state

  @DT007 @undo-redo @functionality
  Scenario: Redo design changes
    When I undo a design change
    And I click the redo button
    Then the change should be reapplied
    And the design should return to the current state

  @DT008 @undo-redo @history
  Scenario: Maintain undo/redo history
    When I make several design changes
    Then I should be able to undo multiple steps
    And I should be able to redo multiple steps

  @DT009 @print-area @positioning
  Scenario: Adjust print area to 3 inches below collar
    When I view the print area guidelines
    Then the print area should be positioned 3 inches below the collar
    And the measurement should be in inches

  @DT010 @print-area @validation
  Scenario: Validate design within print area
    When I place design elements outside the print area
    Then I should see a warning message
    And the design should be constrained to the print area

  @DT011 @print-area @multiple-areas
  Scenario: Support multiple print areas
    When I select different print areas (chest, back, sleeve)
    Then each area should have its own design canvas
    And the print areas should be clearly defined

  @DT012 @design-tool @user-experience
  Scenario: Intuitive design tool interface
    When I use the design tool
    Then the interface should be user-friendly
    And all tools should be easily accessible
    And the design preview should be clear 