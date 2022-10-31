import { Component, OnInit } from '@angular/core';

import { Todo } from './todo.model';
import { TodoService } from './todo.service';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
})
export class TodoComponent implements OnInit {
  newTodoText: string;
  todos: Todo[];

  constructor(private todoService: TodoService) {
    this.newTodoText = '';
    this.todos = [];
  }

  ngOnInit(): void {
    this.todoService.fetchAll().subscribe({
      next: (todos: Todo[]) => {
        this.todos = todos;
      },
    });
  }

  addTodo(): void {
    const hasText = this.newTodoText.trim().length > 0;
    if (hasText) {
      const newTodo: Todo = {
        completed: false,
        editing: false,
        title: this.newTodoText,
      };
      this.todoService.create(newTodo).subscribe(() => {
        this.todos.push(newTodo);
        this.newTodoText = '';
      });
    }
  }

  hasAllTodosCompleted(): boolean {
    return this.todos.length === this.getAllCompletedTodos().length;
  }

  getRemaining(): Todo[] {
    return this.todos.filter((todo: Todo) => !todo.completed);
  }

  getAllCompletedTodos(): Todo[] {
    return this.todos.filter((todo: Todo) => todo.completed);
  }

  editTodo(todo: Todo): void {
    this.todoService
      .update(todo.id as number, {
        editing: true,
      })
      .subscribe({
        next: () => {
          todo.editing = true;
        },
      });
  }

  toggleCompleted(todo: Todo): void {
    this.todoService
      .update(todo.id as number, {
        completed: !todo.completed,
      })
      .subscribe({
        next: () => {
          todo.completed = !todo.completed;
        },
      });
  }

  removeTodo(todo: Todo): void {
    this.todoService.remove(todo.id as number).subscribe({
      next: () => {
        this.todos.splice(this.todos.indexOf(todo), 1);
      },
    });
  }

  stopEditing(todo: Todo, editedTitle: string): void {
    if (!todo.editing) return;

    this.todoService
      .update(todo.id as number, {
        title: editedTitle,
        editing: false,
      })
      .subscribe({
        next: () => {
          todo.title = editedTitle;
          todo.editing = false;
        },
      });
  }

  updateEditingTodo(todo: Todo, editedTitle: string): void {
    editedTitle = editedTitle.trim();
    const hasEmptyText = editedTitle.length === 0;

    if (hasEmptyText) {
      this.removeTodo(todo);
      return;
    }

    this.todoService
      .update(todo.id as number, {
        editing: false,
        title: editedTitle,
      })
      .subscribe({
        next: () => {
          todo.editing = false;
          todo.title = editedTitle;
        },
      });
  }

  cancelEditingTodo(todo: Todo): void {
    this.todoService
      .update(todo.id as number, {
        editing: false,
      })
      .subscribe({
        next: () => {
          todo.editing = false;
        },
      });
  }
}
