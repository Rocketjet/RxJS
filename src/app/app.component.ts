import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { catchError, filter, from, fromEvent, map, Observable, of } from 'rxjs';
import { CustomObserver } from './custom-observer';
import { HttpClient } from '@angular/common/http';
import { User } from './interfaces/user.interface';
import { Comment } from './interfaces/comment.interface';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  http = inject(HttpClient);
  users: User[] = [
    { id: '1', name: 'John', age: 30, isActive: true },
    { id: '2', name: 'Jack', age: 35, isActive: false },
    { id: '3', name: 'Mike', age: 25, isActive: true },
  ];
  comments$: Observable<Comment[]> = this.http
    .get<Comment[]>('http://localhost:3004/comments')
    .pipe(catchError(() => of([]))); //Handling an error an return an observable

  constructor() {
    const numbers$ = of([1, 2, 3, 4]).subscribe((data) => {
      console.log(data); //[1, 2, 3, 4] - конвертує передане значення в Observable
    });
    const numbers1$ = from([1, 2, 3, 4]);
    numbers1$.subscribe((data) => {
      console.log(data); //1, 2, 3, 4  - конвертує передане значення (Array, Promise, Iterable) в Observable і повертає значення один за одним
    });
    numbers1$.subscribe(new CustomObserver()); //кастомний Observer

    //Promise
    const messagePromise = new Promise((resolve) => {
      setTimeout(() => {
        resolve('Promise resolved');
      }, 1000);
    });
    // Using operators
    const users$ = of(this.users);
    const message$ = from(messagePromise);
    const bodyClick$ = fromEvent(document, 'click');
    const userNames$ = of(this.users).pipe(
      map((users) => users.map((user) => user.name))
    );
    const users2$: Observable<User[]> = new Observable((observer) => {
      // observer.next(null);
      setTimeout(() => {
        observer.next(this.users);
        observer.next(this.users.map((user) => ({ ...user, isActive: true })));
      }, 2000);
    });

    const filteredUsers$ = users2$.pipe(
      filter((users) => {
        return users.every((user) => user.isActive);
      }) // Потрібно розуміти, що оператор filter фільтрує не значення масиву, а сам стрім
      // Вище ми емітимо 2 масива де в одному всі користувачі активні, а в іншому ні і у filteredUsers$ попаде лише той, де всі активні
    );

    filteredUsers$.subscribe((users) => {
      console.log(users);
    });

    // Subscribing with Happy path callback
    users$.subscribe((users) => {
      console.log('users', users); // Array of users
    });

    message$.subscribe((message) => {
      console.log('message', message); // Promise resolved
    });

    bodyClick$.subscribe((event) => {
      console.log('event', event);
    });

    // Subscribing with full notation
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

    // Custom Observable
    const users1$ = new Observable((observer) => {
      this.users.forEach((user) => {
        observer.next(user);
      });
    });
  }

  ngOnInit() {
    // this.http
    //   .get<Comment[]>('http://localhost:3004/comments')
    //   .subscribe({
    //     next: (comments) => {
    //       console.log('comments', comments);
    //     },
    //     error: (error) => {
    //       console.log('error', error);
    //     }
    //   });
  }
}
