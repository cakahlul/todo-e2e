describe('Add todo', () => {
  const baseApiUrl = 'http://localhost:3000';

  it('should show a todo item in the todo list after writing a todo', () => {
    const todoItem = 'Todo 1';
    cy.intercept(
      {
        method: 'GET',
        url: `${baseApiUrl}/todos`,
      },
      [],
    ).as('fetchAllTodo');

    cy.intercept('POST', `${baseApiUrl}/todos`, {
      statusCode: 201,
      body: {
        completed: false,
        editing: false,
        title: todoItem,
      },
    }).as('createTodo');

    cy.visit('localhost:4200');
    cy.get('[data-cy="txtTodo"]').type(todoItem).type('{enter}');

    cy.wait('@createTodo').then(() => {
      cy.get('[data-cy="todos"]').should('contain', 'Todo 1');
    });
  });

  it('should show two todo item in the todo list after writing a todo', () => {
    const todoItem = 'Todo 2';
    cy.intercept(
      {
        method: 'GET',
        url: `${baseApiUrl}/todos`,
      },
      [
        {
          id: 1,
          title: 'Todo 1',
          completed: false,
          editing: false,
        },
      ],
    ).as('fetchAllTodo');

    cy.intercept('POST', `${baseApiUrl}/todos`, {
      statusCode: 201,
      body: {
        completed: false,
        editing: false,
        title: todoItem,
      },
    }).as('createTodo');

    cy.visit('localhost:4200');

    cy.wait('@fetchAllTodo').then(() => {
      cy.get('[data-cy="todos"]').should('contain', 'Todo 1');
    });

    cy.get('[data-cy="txtTodo"]').type(todoItem).type('{enter}');

    cy.wait('@createTodo').then(() => {
      cy.get('[data-cy="todos"]')
        .should('contain', 'Todo 1')
        .should('contain', 'Todo 2');
    });
  });
});
