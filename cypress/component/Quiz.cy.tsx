// cypress/component/Quiz.cy.tsx

import React from 'react';
import Quiz from '../../client/src/components/Quiz.tsx';
import { mount } from 'cypress/react18';
import questions from "../fixtures/questions.json";
import '@testing-library/cypress/add-commands';

describe('<Quiz />', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/questions/random', (req) => {
      req.reply({
        statusCode: 200,
        body: questions
      });
    }).as('getRandomQuestion');
  });

  it('should render the quiz page and start quiz button if the game hasnt started', () => {
    mount(<Quiz />);
    // do a cy get targeting a class or data and ensure that the start quiz button is visible
    cy.get('[data-cy=game]').should('be.visible');
    cy.get('[data-cy=game]').should('contain', questions.maskedWord);
    cy.get('[data-cy=keyboard]').should('be.visible');
    cy.get('[data-cy=countdown]').should('be.visible').and('contain', questions.guessesRemaining);
  });

  it('should hide the game area and show "You won!" when the game is won', () => {
    mount(<Quiz />);

    // Wait for the game to start
    cy.wait('@getRandomWord');

    // Simulate final correct guess
    cy.get('[data-cy=s]').click();
    cy.wait('@postGuess');

    // Check if the winning message is displayed
    cy.get('[data-cy=game-area]').should('not.exist');
    cy.contains('You won!').should('be.visible');
  });

  it('should hide the game area and show a loss message when the game is complete but the word contains underscores', () => {
    mount(<Quiz />);

    // Wait for the game to start
    cy.wait('@getRandomWord');

    // Simulate incorrect guesses
    cy.get('[data-cy=a]').click();
    cy.wait('@postGuess');

    // Check if the loss message is displayed
    cy.get('[data-cy=game-area]').should('not.exist');
    cy.contains('You lost!').should('be.visible'); // Adjust the text based on the actual implementation
  });
});
// describe('<Countdown />', () => {
//   it('should initially render with a maximum of 9 guesses', () => {
//     // see: https://on.cypress.io/mounting-react
//     cy.mount(<Countdown guesses={9}/>)
//     cy.get('[data-cy="countdown"]').should('exist').and('have.text', 'Guesses Remaining: 9')
//   })

//   it('should render with a different number of guesses', () => {
//     cy.mount(<Countdown guesses={5}/>)
//     cy.get('[data-cy="countdown"]').should('exist').and('have.text', 'Guesses Remaining: 5')
//   })

//   it('should render a correct guess message', () => {
//     cy.mount(<Countdown guesses={5} isCorrect={true} hasGuessed={true}/>)
//     cy.get('[data-cy="toast"]').should('exist').and('contain.text', 'Correct!')
//   })

//   it('should render an incorrect guess message', () => {
//     cy.mount(<Countdown guesses={5} isCorrect={false} hasGuessed={true}/>)
//     cy.get('[data-cy="toast"]').should('exist').and('contain.text', 'Incorrect!')
//   })
// })
