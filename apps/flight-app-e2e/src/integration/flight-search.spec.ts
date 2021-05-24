describe('flight-search', () => {
  beforeEach(() => cy.visit('/flight-booking/flight-search'));

  it('should display 3 flights on search', () => {
    cy.get('flight-search button:first').contains('Search').click();

    cy.get('div.row > div').should('have.length', '3');
  });

  it('should remove flight from basket', () => {
    cy.get('flight-search button:first').contains('Search').click();

    cy.get('div.row > div:first button:first').contains('Remove').click();

    cy.get('flight-search div.card:last').contains('"3": false');
  });
});
