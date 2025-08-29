Feature: Products Page
  As a user
  I want to browse and interact with products
  So that I can find and purchase items

  Background:
    Given I am on the products page

  @PR001 @navigation
  Scenario: Verify Home link navigates to default channel
    When I click on the Home link in breadcrumb
    Then I should be redirected to the home page

  @PR002 @layout
  Scenario: Products label is visible and correct
    Then the "Products" label should be visible in the breadcrumb

  @PR003 @interaction
  Scenario: Home link has hover effect
    When I hover over the Home link
    Then the Home link should have a hover effect

  @PR004 @layout
  Scenario: Icons next to Home and Products are displayed
    Then breadcrumb icons should be visible

  @PR005 @layout
  Scenario: Breadcrumb order is correct
    Then the breadcrumb should show "Home > Products" in correct order

  @PR006 @offline
  Scenario: Clicking Home while offline
    When I set the page to offline mode
    And I click on the Home link
    Then the page should handle offline navigation gracefully

  @PR007 @accessibility
  Scenario: Product list has ARIA label for accessibility
    Then all product elements should have ARIA labels

  @PR008 @interaction
  Scenario: Products label does not trigger action
    When I click on the "Products" label
    Then I should remain on the products page

  @PR009 @interaction
  Scenario: No unexpected popup on Home hover
    When I hover over the Home breadcrumb
    Then no popup, tooltip, or modal should appear

  @PR010 @content
  Scenario: Product list displays at least one product
    Then at least one product should be displayed

  @PR011 @content
  Scenario: Each product shows name and price correctly
    Then products should display name and price information
    And the price format should be "From: $X.X"

  @PR012 @navigation
  Scenario: Click product name navigates to detail page
    When I click on the first product name
    Then I should be redirected to the product detail page
    And the product detail page should show the correct product name

  @PR013 @content
  Scenario: Product image loads correctly
    Then the first product image should be visible and loaded

  @PR014 @content
  Scenario: Price format is correct
    Then the first product price should match the format "From: $X.X"

  @PR015 @interaction
  Scenario: Hover on product enlarges card
    When I hover over a product card
    Then the product card should be enlarged

  @PR016 @layout
  Scenario: Products are displayed in a grid layout
    Then products should be displayed in a grid layout
    And the grid should have multiple columns

  @PR017 @validation
  Scenario: No broken product links
    Then all product links should have valid href attributes

  @PR018 @content
  Scenario: No products displayed when list is empty
    When I navigate to the products page with empty list
    Then no products should be displayed

  @PR019 @responsive
  Scenario: Product page is responsive on mobile
    When I view the products page on mobile screen
    Then the product cards should be visible and properly displayed

  @PR020 @layout
  Scenario: Products label has correct font size and color
    Then the "Products" label should have proper font size and color

  @PR021 @interaction
  Scenario: Hover on Home does not affect unrelated elements
    When I hover on the Home link
    Then unrelated product elements should remain unchanged

  @PR022 @accessibility
  Scenario: Product image has alt attribute
    Then all product list images should have alt attributes

  @PR023 @accessibility
  Scenario: Keyboard navigation works on product cards
    When I press Tab key multiple times
    Then a product card should receive focus

  @PR024 @accessibility
  Scenario: Product cards are focusable via keyboard
    Then all product cards should have tabindex attributes

  @PR025 @responsive
  Scenario: Product grid handles window resize properly
    When I resize the window from desktop to tablet
    Then the grid layout should adapt to the new size

  @PR026 @content
  Scenario: Broken image fallback is handled
    When I navigate to the products page with broken images
    Then images should load with fallback handling

  @PR027 @search
  Scenario: No products found message appears when search yields no results
    When I search for a non-existent product
    Then I should see "No results found" search message 