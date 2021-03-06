import Chainable = Cypress.Chainable;

class Sidemenu {
  click(name: 'Customers' | 'Holidays'): Chainable {
    return cy.get('mat-drawer a').contains(name).click();
  }
}

export const sidemenu = new Sidemenu();
