describe('Get All todo list', () => {
  const baseApiUrl = 'http://localhost:3000';
  const mockTodoList = [
    {
      id: 1,
      title: 'Todo 1',
      completed: false,
      editing: false,
    },
    {
      id: 2,
      title: 'Todo 2',
      completed: false,
      editing: false,
    },
    {
      id: 3,
      title: 'Todo 3',
      completed: false,
      editing: false,
    },
  ];

  it('should fetch list todos from localhost:3000/todos url when open todo app', () => {
    cy.intercept(
      {
        method: 'GET',
        url: `${baseApiUrl}/todos`,
      },

      mockTodoList,
    ).as('fetchAllTodo');

    cy.visit('localhost:4200');

    cy.wait('@fetchAllTodo').then(() => {
      cy.get('[data-cy="todos"]')
        .should('contain', 'Todo 1')
        .and('contain', 'Todo 2');
    });
  });
});
