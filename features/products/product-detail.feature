Feature: Product Detail Page - Safe Testing
  As a user
  I want to view and interact with product details safely
  So that I can make informed purchasing decisions without browser crashes

  Background:
    Given I am on the product detail page for "bella-3001"

  @PD001 @content
  Scenario: Verify Product Title is displayed correctly
    Then the product title should be "BELLA + CANVAS - Jersey Tee - 3001"

  @PD002 @content
  Scenario: Verify Product Image is displayed
    Then the product images should be visible

  @PD003 @interaction
  Scenario: Verify Color options are displayed and selectable safely
    Then color options should be displayed
    And I should be able to select colors safely

  @PD004 @interaction
  Scenario: Verify Size options are displayed and selectable
    Then size options should be displayed
    And I should be able to select different sizes

  @PD005 @content
  Scenario: Verify Price is displayed correctly
    Then the product price should be visible and formatted correctly

  # @PD006 @interaction
  # Scenario: Verify Add to Cart button is clickable
  #   Then the "Add to Cart" button should be visible and clickable

  # @PD007 @interaction
  # Scenario: Verify Quantity selector is working correctly
  #   When I change the quantity to "2"
  #   Then the quantity should be updated to "2"

  # @PD008 @cart
  # Scenario: Verify Product is added to Cart correctly
  #   When I select size "M"
  #   And I set quantity to "1"
  #   And I click "Add to Cart"
  #   Then the product should be added to cart successfully

  # @PD009 @validation
  # Scenario: Verify Error message for invalid quantity
  #   Given I am logged in as "testaccount123@mailinator.com"
  #   When I clear the quantity field
  #   And I click "Add to Cart"
  #   Then I should see an error message "Something went wrong. Please try again later"

  @PD010 @interaction
  Scenario: Verify Product Images Carousel works correctly
    When I click on a product image thumbnail
    Then the main product image should change

  @PD011 @content
  Scenario: Verify Product Features list is displayed
    Then the "Features" section should be visible
    And the features list should contain at least one item

  @PD012 @navigation
  Scenario: Verify Breadcrumb navigation works
    When I click on the "Products" breadcrumb link
    Then I should be redirected to the products page

  @PD013 @seo
  Scenario: Verify Product URL is SEO friendly
    Then the URL should contain "bella-3001"

  @PD014 @interaction
  Scenario: Verify Image changes with color selection
    When I select a different color option
    Then the product image should change to match the selected color

  @PD015 @authentication
  Scenario: Verify Add to Cart without selecting Size redirects to login
    When I click "Add to Cart" without selecting size
    Then I should be redirected to the login page

  @PD016 @content
  Scenario: Verify Product Description is displayed and formatted correctly
    Then the "Descriptions" section should be visible
    And the description should contain "BELLA + CANVAS Jersey Tee"

  # @PD017 @navigation
  # Scenario: Verify Customize Design button navigates correctly
  #   When I click the "Customize Design" button
  #   Then I should be redirected to the design page

  @PD018 @layout
  Scenario: Verify product detail page layout is responsive
    When I view the product detail page on mobile screen
    Then all product elements should be properly displayed

  @PD019 @accessibility
  Scenario: Verify product images have alt attributes
    Then all product detail images should have alt attributes

  @PD020 @interaction
  Scenario: Verify quantity input accepts valid values
    When I enter quantity "5"
    Then the quantity should be set to "5"

  @PD021 @validation
  Scenario: Verify quantity input rejects invalid values
    When I enter quantity "-1"
    Then the quantity should not be accepted

  @PD022 @content
  Scenario: Verify product information is complete
    Then the product should display title, price, and description
    And all product images should load without errors

  @PD023 @interaction
  Scenario: Verify size selection updates product availability
    When I select size "L"
    Then the size "L" should be marked as selected

  @PD024 @interaction
  Scenario: Verify color selection updates product appearance
    When I select a specific color
    Then the selected color should be visually indicated

  @PD025 @performance
  Scenario: Verify product detail page loads within acceptable time
    Then the page should load within 10 seconds 