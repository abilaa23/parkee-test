describe('Technical Test Parkee - WEB', () => {
    beforeEach(() => {
        cy.visit('https://www.saucedemo.com/');
    });

    it('User successfully login, add a product to cart, checkout, and complete order', () => {
        // Login
        cy.get('[data-test="username"]').type('standard_user');
        cy.get('[data-test="password"]').type('secret_sauce');
        cy.get('[data-test="login-button"]').click();

        // Verify login success
        cy.url().should('include', '/inventory.html');
        cy.contains('Products').should('be.visible');

        // Add product to cart
        cy.get('.inventory_item').first().within(() => {
            cy.get('button').click();
        });

        // Go to cart
        cy.get('.shopping_cart_link').click();
        cy.url().should('include', '/cart.html');

        // Proceed to checkout
        cy.get('[data-test="checkout"]').click();

        // Fill in checkout information
        cy.get('[data-test="firstName"]').type('Abila Aprilia');
        cy.get('[data-test="lastName"]').type('Rachmadhany');
        cy.get('[data-test="postalCode"]').type('35144');
        cy.get('[data-test="continue"]').click();

        // Verify checkout overview
        cy.url().should('include', '/checkout-step-two.html');

        // Complete the purchase
        cy.get('[data-test="finish"]').click();

        // Verify order completion
        cy.get('.complete-header').should('have.text', 'Thank you for your order!');
    });

    it('User should fail login with invalid credentials', () => {
        cy.get('[data-test="username"]').type('invalid_user');
        cy.get('[data-test="password"]').type('wrong_password');
        cy.get('[data-test="login-button"]').click();

        // Verify error message appears
        cy.get('[data-test="error"]').should('contain', 'Epic sadface: Username and password do not match any user in this service');
    });

    it('User should fail checkout with missing required fields', () => {
        cy.get('[data-test="username"]').type('standard_user');
        cy.get('[data-test="password"]').type('secret_sauce');
        cy.get('[data-test="login-button"]').click();

        // Verify login success
        cy.url().should('include', '/inventory.html');
        cy.contains('Products').should('be.visible');

        // Add product to cart
        cy.get('.inventory_item').first().within(() => {
            cy.get('button').click();
        });

        // Go to cart
        cy.get('.shopping_cart_link').click();
        cy.url().should('include', '/cart.html');

        // Proceed to checkout
        cy.get('[data-test="checkout"]').click();

        // Leave all fields blank and try to continue
        cy.get('[data-test="continue"]').click();
        cy.get('[data-test="error"]').should('contain', 'Error: First Name is required');

        // Fill first name, leave others blank
        cy.get('[data-test="firstName"]').type('Abila');
        cy.get('[data-test="continue"]').click();
        cy.get('[data-test="error"]').should('contain', 'Error: Last Name is required');

        // Fill last name, leave postal code blank
        cy.get('[data-test="lastName"]').type('Aprilia');
        cy.get('[data-test="continue"]').click();
        cy.get('[data-test="error"]').should('contain', 'Error: Postal Code is required');
    });

    it('should redirect to login when accessing checkout page without authentication', () => {
        // Try visiting checkout directly
        cy.visit('https://www.saucedemo.com/checkout-step-one.html', { failOnStatusCode: false });
    
        // Verify that the user is redirected to the login page
        cy.url().should('eq', 'https://www.saucedemo.com/');
    });
    
});
