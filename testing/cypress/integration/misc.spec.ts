/// <reference types="cypress" />

import ViewportPreset = Cypress.ViewportPreset;
import { sidemenu } from '../pom/sidemenu';

describe('misc e2e test', () => {
  it('should do a sanity check', () => {
    cy.visit('');
  });

  it('should load page below 1 second', () => {
    cy.visit('/', {
      onBeforeLoad: (win) => {
        win.performance.mark('start-loading');
      },
      onLoad: (win) => {
        win.performance.mark('end-loading');
      }
    })
      .its('performance')
      .then((p) => {
        p.measure('pageLoad', 'start-loading', 'end-loading');
        const measure = p.getEntriesByName('pageLoad')[0];
        expect(measure.duration).to.be.most(1000);
      });
  });

  context('entries count', () =>
    ['ipad-2', 'ipad-mini', 'iphone-6', 'samsung-s10'].forEach((resolution: ViewportPreset) => {
      it(`should count the entries for ${resolution}`, () => {
        cy.viewport(resolution);
        cy.visit('');
        // cy.get('mat-drawer a').contains('Customers').click();
        sidemenu.click('Customers');
        cy.get('div.row:not(.header)').should('have.length', 22);
      });
    })
  );
});
