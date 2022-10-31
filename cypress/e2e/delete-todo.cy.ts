describe('Delete', () => {
  const baseApiUrl = 'http://localhost:3000';
  const mockTodoList = [
    {
      id: 1,
      title: 'Cycling',
      completed: false,
      editing: false,
    },
  ];
  it('should remove todo item "Cycling" when click button x', () => {
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

    cy.intercept('DELETE', `${baseApiUrl}/todos/1`, {
      statusCode: 200,
      body: {
        complete: true,
      },
    }).as('remove');

    cy.visit('localhost:4200');
    cy.wait('@fetchAllTodo').then(() => {
      cy.get('[data-cy="toggleTodo"]').click();
      cy.wait('@markAsComplete').then(() => {
        cy.get('[data-cy="btnRemoveTodo"]').invoke('show').click();
      });
      cy.wait('@remove').then(() => {
        cy.get('[data-cy="todos"]').should('not.exist');
      });
    });
  });
});
