import questions from "../fixtures/questions.json";

describe('Quiz E2E Test', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/questions/random', (req) => {
      req.reply({
        statusCode: 200,
        body: questions
      });
    }).as('getQuestions');
  });

  it('should display the first question and answers when the quiz starts', () => {
    cy.visit('/');
    cy.contains('Start Quiz').click();
    cy.wait('@getQuestions');
    
    cy.contains(questions[0].question).should('be.visible');
    questions[0].answers.forEach((answer) => {
      cy.contains(answer.text).should('be.visible');
    });
  });

  it('should navigate to the next question after answering correctly', () => {
    cy.visit('/');
    cy.contains('Start Quiz').click();
    cy.wait('@getQuestions');

    const correctAnswerIndex = questions[0].answers.findIndex((a) => a.isCorrect);
    cy.get(`button`).eq(correctAnswerIndex).click();

    cy.contains(questions[1].question).should('be.visible');
  });

  it('should display the quiz completion screen when all questions are answered', () => {
    cy.visit('/');
    cy.contains('Start Quiz').click();
    cy.wait('@getQuestions');

    questions.forEach((q, index) => {
      const correctAnswerIndex = q.answers.findIndex((a) => a.isCorrect);
      cy.get('button').eq(correctAnswerIndex).click();

      if (index < questions.length - 1) {
        cy.contains(questions[index + 1].question).should('be.visible');
      }
    });

    cy.contains('Quiz Completed').should('be.visible');
    cy.contains(`Your score: ${questions.length}/${questions.length}`).should('be.visible');
    cy.contains('Take New Quiz').should('be.visible');
  });

  it('should show 9/10 score when one question is answered incorrectly', () => {
    cy.visit('/');
    cy.contains('Start Quiz').click();
    cy.wait('@getQuestions');

    questions.forEach((q, index) => {
      const correctAnswerIndex = q.answers.findIndex((a) => a.isCorrect);
      if (index < questions.length - 1) {
        cy.get('button').eq(correctAnswerIndex).click();
      } else {
        const incorrectAnswerIndex = q.answers.findIndex((a) => !a.isCorrect);
        cy.get('button').eq(incorrectAnswerIndex).click();
      }

      if (index < questions.length - 1) {
        cy.contains(questions[index + 1].question).should('be.visible');
      }
    });

    cy.contains('Quiz Completed').should('be.visible');
    cy.contains('Your score: 9/10').should('be.visible');
    cy.contains('Take New Quiz').should('be.visible');
  });

  it('should start a new quiz when "Take New Quiz" is clicked', () => {
    cy.visit('/');
    cy.contains('Start Quiz').click();
    cy.wait('@getQuestions');
  
    questions.forEach((q, index) => {
      const correctAnswerIndex = q.answers.findIndex((a) => a.isCorrect);
      cy.get('button').eq(correctAnswerIndex).click();
  
      if (index < questions.length - 1) {
        cy.contains(questions[index + 1].question).should('be.visible');
      }
    });
  
    cy.contains('Quiz Completed').should('be.visible');
    cy.contains(`Your score: ${questions.length}/${questions.length}`).should('be.visible');
    cy.contains('Take New Quiz').should('be.visible');
    
    cy.contains('Take New Quiz').click();
    
    cy.contains(questions[0].question).should('be.visible');
    questions[0].answers.forEach((answer) => {
      cy.contains(answer.text).should('be.visible');
    });
  });
  
});
