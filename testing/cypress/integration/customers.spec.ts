/// <reference types="cypress" />

import { sidemenu } from '../pom/sidemenu';
import { customer } from '../pom/customer';

describe('customers e2e test', () => {
  it('should count the entries', () => {
    cy.visit('');
    // cy.get('mat-drawer a').contains('Customers').click();
    sidemenu.click('Customers');
    cy.get('div.row:not(.header)').should('have.length', 22);
  });

  it('should rename Latitia to Laetitia', () => {
    cy.visit('');
    // cy.get('mat-drawer a').contains('Customers').click();
    sidemenu.click('Customers');
    cy.get('div').contains('Latitia Bellitissa').siblings('.edit').click();
    cy.get('input:first').clear().type('Laetitia');
    cy.get('button[type=submit]').click();

    cy.get('div').contains('Bellitissa').should('have.text', 'Laetitia Bellitissa');
  });

  it('should add a new person', () => {
    cy.visit('');
    // cy.get('mat-drawer a').contains('Customers').click();
    sidemenu.click('Customers');
    cy.get('mat-drawer-content a').contains('Add Customer').click();

    /*cy.get('input:first').type('Tom');
    cy.get('input:eq(1)').type('Lincoln');
    cy.get('mat-select').click().get('mat-option').contains('USA').click();
    cy.get('input:eq(2)').type('12.10.1995');
    cy.get('button[type=submit]').click();*/

    customer.setFirstname('Tom');
    customer.setLastname('Lincoln');
    customer.setCountry('USA');
    customer.setBirthday(new Date(1995, 9, 12));
    customer.submit();

    cy.get('div').contains('Tom Lincoln');
  });
});
