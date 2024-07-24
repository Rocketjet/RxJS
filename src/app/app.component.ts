import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  catchError,
  combineLatest,
  distinct,
  distinctUntilChanged,
  distinctUntilKeyChanged,
  filter,
  forkJoin,
  from,
  fromEvent,
  map,
  Observable,
  of,
  scan,
  tap,
  withLatestFrom,
} from 'rxjs';
import { CustomObserver } from './custom-observer';
import { HttpClient } from '@angular/common/http';
import { User } from './interfaces/user.interface';
import { Comment } from './interfaces/comment.interface';
import { CommonModule } from '@angular/common';
import { FilterMapComponent } from './components/filter-map/filter-map.component';
import { DebounceComponent } from './components/debounce/debounce.component';
import { SubjectComponent } from './components/subject/subject.component';
import { TodoService } from './services/todo.service';
import { Todo } from './interfaces/todo.interface';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    FilterMapComponent,
    DebounceComponent,
    SubjectComponent,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  http = inject(HttpClient);
  todoService = inject(TodoService);

  users: User[] = [
    { id: '1', name: 'John', age: 30, isActive: true },
    { id: '2', name: 'Jack', age: 35, isActive: false },
    { id: '3', name: 'Mike', age: 25, isActive: true },
    { id: '3', name: 'Monika', age: 25, isActive: true },
  ];
  comments$: Observable<Comment[]> = this.http
    .get<Comment[]>('http://localhost:3004/comments')
    .pipe(catchError(() => of([]))); //? Handling an error an returning an observable

  constructor() {}

  ngOnInit() {
    //? Promise
    const messagePromise = new Promise((resolve) => {
      setTimeout(() => {
        resolve('Promise resolved');
      }, 1000);
    });
    //<--------------------------------------------------------------------------->
    //? Using operators
    of([1, 2, 3, 4]).subscribe((data) => {
      console.log(data); //[1, 2, 3, 4] - конвертує передане значення в Observable
    });
    const numbers1$ = from([1, 2, 3, 4]);
    numbers1$.subscribe((data) => {
      console.log(data); //1, 2, 3, 4  - конвертує передане значення (Array, Promise, Iterable) в Observable і повертає значення один за одним
    });
    numbers1$.subscribe(new CustomObserver()); //? кастомний Observer
    //! of()
    const users$ = of(this.users);
    //! from()
    const message$ = from(messagePromise);
    //! fromEvent()
    const bodyClick$ = fromEvent(document, 'click');
    of(this.users).pipe(map((users) => users.map((user) => user.name)));
    //! combineLatest()
    combineLatest({
      users: of(this.users),
      messagePromise: from(messagePromise),
    }); //використовується, коли треба згрупувати декілька стрімів в єдиний стрім
    // Працюватиме лише за умови, що кожен стрім надасть хоча б одне значення
    //! forkJoin()
    //? Схожий на Promise.all по своїй суті, тобто надасть останні актуальні значення в стрімі для кожного Observable, але якщо жоден не викинув помилку
    const posts$ = this.http.get('http://localhost:3004/posts');
    const comments$ = this.http.get('http://localhost:3004/comments');
    forkJoin({
      posts: posts$,
      comments: comments$,
    }).subscribe((result) => {
      console.log(result);
    });
    //! withLatestFrom()
    //? Емітить значення лише якщо основний Observable надав значення в свою чергу.
    //? тобто тільки коли ми отримали пости, ми візьмемо 'initial value' як останнє значення в стрімі, очікування 5 секунд не відбуватиметься
    const customValue$ = new Observable((observer) => {
      observer.next('initial value');
      setTimeout(() => {
        observer.next('delayed value');
      }, 5000);
    });
    const posts1$ = this.http.get('http://localhost:3004/posts');
    posts1$.pipe(withLatestFrom(customValue$)).subscribe((result) => {
      console.log(result);
      /*
        0: Array(2) 
          {id: '1', title: 'Learn RXJS'}
          {id: '2', title: 'Learn Angular'}
        1: 'initial value'
      */
    });
    //? Creating an Observable manually
    const users2$: Observable<User[]> = new Observable((observer) => {
      // observer.next(null);
      setTimeout(() => {
        observer.next(this.users);
        observer.next(this.users.map((user) => ({ ...user, isActive: true })));
      }, 2000);
    });
    //! filter()
    const filteredUsers$ = users2$.pipe(
      filter((users) => {
        return users.every((user) => user.isActive);
      }) // Оператор filter фільтрує значення, які попадають в стрім, а вже далі, якщо це значення - масив, ми фільтруємо його методом масивів
      // Вище ми емітимо 2 масива де в одному всі користувачі активні, а в іншому ні і у filteredUsers$ попаде лише той, де всі активні
    );

    filteredUsers$.subscribe((users) => {
      console.log(users);
    });
    //? Distinct operators
    //! distinct()
    from(this.users)
      .pipe(distinct((user) => user.age))
      .subscribe((users) => {
        console.log(users); // В підписку попадуть юзери у яких вік не повторюється
      });

    new Observable((observer) => {
      observer.next(1);
      observer.next(1);
      observer.next(2);
      observer.next(3);
      observer.next(3);
    })
      .pipe(distinct())
      .subscribe((value) => {
        console.log(value); // 1, 2, 3
      });
    //! distinctUntilChanged()
    new Observable((observer) => {
      observer.next(1);
      observer.next(2);
      observer.next(1);
    })
      .pipe(distinctUntilChanged())
      .subscribe((value) => {
        console.log(value); // 1, 2, 1
      });
    //! distinctUntilKeyChanged()
    new Observable<{ name: string }>((observer) => {
      observer.next({ name: 'John' });
      observer.next({ name: 'John' });
      observer.next({ name: 'Mike' });
      observer.next({ name: 'Mike' });
    })
      .pipe(distinctUntilKeyChanged('name'))
      .subscribe((value) => {
        console.log(value); // { name: 'John' }, { name: 'Mike' }
      });
    //<--------------------------------------------------------------------------->
    //? Subscribing with Happy path callback example
    users$.subscribe((users) => {
      console.log('users', users); // Array of users
    });

    message$.subscribe((message) => {
      console.log('message', message); // Promise resolved
    });

    bodyClick$.subscribe((event) => {
      console.log('event', event);
    });
    //<--------------------------------------------------------------------------->
    //? Subscribing with full notation example
    message$.subscribe({
      next: (message) => {
        console.log('message', message);
      },
      error: (error) => {
        console.log('error', error);
      },
      complete: () => {
        console.log('complete');
      },
    });
    //<--------------------------------------------------------------------------->
    //? Manually created Observable
    new Observable((observer) => {
      this.users.forEach((user) => {
        observer.next(user);
      });
    });
    //<--------------------------------------------------------------------------->
    //? Working with Subjects
    this.todoService.todos$.pipe(
      scan((acc: Todo[] | [], val) => {
        const isAdded = val.length > acc.length;
        const isUpdated = val.length === acc.length && val.length !== 0;
        const isRemoved = val.length < acc.length;
        if (isAdded) {
          console.log('todo has been added', val);
        } else if (isUpdated) {
          console.log('todo has been updated', val);
        } else if (isRemoved) {
          console.log('todo has been removed', val);
        }
        return val;
      }, [])
    ).subscribe();

    this.todoService.addTodo('Learn Angular');
    this.todoService.toggleTodo(this.todoService.todos$.getValue()[0].id);
    this.todoService.removeTodo(this.todoService.todos$.getValue()[0].id);
  }
}
