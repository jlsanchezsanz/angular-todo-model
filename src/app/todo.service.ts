import { Injectable } from "@angular/core";
import { Model, ModelFactory } from "@angular-extensions/model";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Todo } from "./todo.model";

const initialData: Todo[] = [];

@Injectable({
  providedIn: "root"
})
export class TodoService {
  private model: Model<Todo[]>;

  todos$: Observable<Todo[]>;

  public get completedTodos$(): Observable<Todo[]> {
    return this.model.data$.pipe(
      map((todos: Todo[]) => todos.filter(todo => todo.isCompleted))
    );
  }
  public get uncompletedTodos$(): Observable<Todo[]> {
    return this.model.data$.pipe(
      map((todos: Todo[]) => todos.filter(todo => !todo.isCompleted))
    );
  }

  constructor(private modelFactory: ModelFactory<Todo[]>) {
    this.model = this.modelFactory.create(initialData);
  }

  addTodo(title: string) {
    const todos = this.model.get();
    const id = todos.length
      ? `${parseInt(todos[todos.length - 1].id, 10) + 1}`
      : "1";

    todos.push({ id, title, isCompleted: false });

    this.model.set(todos);
  }

  setCompleted(id: string) {
    const todos = this.model.get();
    this.model.set(
      todos.map(todo => {
        if (todo.id === id) {
          todo.isCompleted = true;
        }
        return todo;
      })
    );
  }

  removeTodo(id: string) {
    const todos = this.model.get();
    this.model.set(todos.filter(todo => todo.id !== id));
  }
}
