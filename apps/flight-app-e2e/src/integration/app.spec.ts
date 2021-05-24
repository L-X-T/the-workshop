describe('flight-app', () => {
  beforeEach(() => cy.visit('/'));

  it('should do a sanity check', () => {
    cy.visit('/');
  });

  it('should have UTF-8 as charset', () => {
    cy.document().should('have.property', 'charset').and('eq', 'UTF-8');
  });

  it('should do an implicit subject assertion', () => {
    cy.get('.sidebar-wrapper ul.nav li:last a').should('contain.text', 'Basket');
  });

  it('should do an explicit subject assertion', () => {
    cy.get('.sidebar-wrapper ul.nav li:nth-child(2) a').should(($a) => {
      expect($a).to.contain.text('Flights');
      expect($a).to.have.attr('href', '/flight-booking/flight-search');
    });
  });

  it('should count the nav entries', () => {
    cy.get('.sidebar-wrapper ul.nav li').should('have.length', '3');
  });

  it('should display 3 flights on search', () => {
    cy.visit('/flight-booking/flight-search');

    cy.get('flight-search button:first').contains('Search').click();

    cy.get('div.row > div').should('have.length', '3');
  });

  it('should remove flight from basket', () => {
    cy.visit('/flight-booking/flight-search');

    cy.get('flight-search button:first').contains('Search').click();

    cy.get('div.row > div:first button:first').contains('Remove').click();

    cy.get('flight-search div.card:last').contains('"3": false');
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
});
