describe('Mark Complete', () => {
  const baseApiUrl = 'http://localhost:3000';
  const mockTodoList = [
    {
      id: 1,
      title: 'Cycling',
      completed: false,
      editing: false,
    },
  ];

  const mockCompleteTodoList = [
    {
      id: 1,
      title: 'Cycling',
      completed: true,
      editing: false,
    },
  ];

  it('should show striketrhough and checked checkbox in "Cycling" todo item when click check box', () => {
    cy.intercept(
      {
        method: 'GET',
        url: `${baseApiUrl}/todos`,
      },

      mockTodoList,
    ).as('fetchAllTodo');

    cy.intercept('PATCH', `${baseApiUrl}/todos/1`, {
      statusCode: 200,
      body: {
        complete: true,
      },
    }).as('markAsComplete');

    cy.visit('localhost:4200');
    cy.wait('@fetchAllTodo').then(() => {
      cy.get('[data-cy="toggleTodo"]').click();
      cy.wait('@markAsComplete').then(() => {
        cy.get('[data-cy="todos"]').should('have.class', 'completed');
      });
    });
  });

  it('should remove striketrhough and uncheck checkbox in "Cycling" todo item when click check box', () => {
    cy.intercept(
      {
        method: 'GET',
        url: `${baseApiUrl}/todos`,
      },

      mockCompleteTodoList,
    ).as('fetchAllTodo');

    cy.intercept('PATCH', `${baseApiUrl}/todos/1`, {
      statusCode: 200,
      body: {
        complete: false,
      },
    }).as('markAsUncomplete');

    cy.visit('localhost:4200');
    cy.wait('@fetchAllTodo').then(() => {
      cy.get('[data-cy="toggleTodo"]').click();
      cy.wait('@markAsUncomplete').then(() => {
        cy.get('[data-cy="todos"]').should('not.have.class', 'completed');
      });
    });
  });
});
