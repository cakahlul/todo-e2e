describe('Edit todo', () => {
  const baseApiUrl = 'http://localhost:3000';

  it('should be able to edit after adding a new todo item', () => {
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
        id: 1,
        completed: false,
        editing: false,
        title: todoItem,
      },
    }).as('createTodo');

    cy.intercept('PATCH', `${baseApiUrl}/todos/1`, {
      statusCode: 200,
      body: {
        editing: true,
      },
    }).as('markAsEdited');

    cy.visit('localhost:4200');
    cy.get('[data-cy="txtTodo"]').type(todoItem).type('{enter}');

    cy.wait('@createTodo').then(() => {
      cy.get('[data-cy="lblEditTodo"]').dblclick();
      cy.wait('@markAsEdit').then(() => {
        cy.get('[data-cy="todos"]').should('have.class', 'editing');
      });
    });
  });
});
