/// <reference types="cypress" />

describe('holidays e2e test', () => {
  it('should do an implicit subject assertion', () => {
    cy.visit('');
    cy.get('mat-drawer a:first').should('have.text', 'Holidays');
  });

  it('should do an explicit subject assertion', () => {
    cy.visit('');
    cy.get('mat-drawer a:first').should(($a) => {
      expect($a).to.have.text('Holidays');
      expect($a).to.have.class('mat-raised-button');
      expect($a).to.have.attr('href', '/holidays');
    });
  });

  it('should visit holidays page', () => {
    cy.visit('');
    cy.get(':nth-child(1) > .mat-focus-indicator > .mat-button-wrapper').click();
    cy.get('mat-card').contains('Angkor Wat');
  });

  it('should stub the holidays', () => {
    cy.server();
    cy.route({
      method: 'GET',
      url: /holidays\.json$/,
      response: {
        holidays: [
          {
            title: 'Unicorn',
            teaser: 'You found One Piece',
            imageUrl: 'https://eternal-app.s3.eu-central-1.amazonaws.com/assets/OnePiece.png',
            description: 'Congratulations, you finally found Unicorn. Roger would be proud of you.'
          }
        ]
      }
    });
    cy.visit('');
    cy.get('mat-drawer a').contains('Holidays').click();
    cy.get('mat-card-title').contains('Unicorn');
  });
});
