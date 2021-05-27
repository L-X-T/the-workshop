import Chainable = Cypress.Chainable;

class Customer {
  setFirstname(firstname: string): Chainable {
    return cy.get('input:first').clear().type(firstname);
  }

  setLastname(lastname: string): Chainable {
    return cy.get('input:eq(1)').clear().type(lastname);
  }

  setCountry(country: string): Chainable {
    return cy.get('mat-select').click().get('mat-option').contains(country).click();
  }

  setBirthday(date: Date): Chainable {
    return cy.get('input:eq(2)').clear().type(Cypress.moment(date).format('DD.MM.yyyy'));
  }

  submit(): Chainable {
    return cy.get('button[type=submit]').click();
  }
}

export const customer = new Customer();
