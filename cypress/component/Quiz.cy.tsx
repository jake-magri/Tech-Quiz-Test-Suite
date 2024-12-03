import Quiz from '../../client/src/components/Quiz.tsx';
import { mount } from 'cypress/react18';
import '@testing-library/cypress/add-commands';
import '../support/component'; 

describe('<Quiz />', () => {
  it('should render the start quiz button when the game has not started', () => {
    mount(<Quiz />);
    cy.contains('Start Quiz').should('be.visible');
  });
});
