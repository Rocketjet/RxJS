import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Todo } from '../interfaces/todo.interface';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  todos$ = new BehaviorSubject<Todo[]>([]);

  constructor() { }
  
  addTodo(text: string) {
    const newTodo: Todo = {
      text,
      id: Date.now().toString(),
      completed: false,
    };
    this.todos$.next([...this.todos$.getValue(), newTodo]);
  }

  removeTodo(id: string) {
    this.todos$.next(this.todos$.getValue().filter((todo) => todo.id !== id));
  }

  toggleTodo(id: string) {  
    this.todos$.next(
      this.todos$.getValue().map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }
}
