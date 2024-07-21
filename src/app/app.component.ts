import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { from, fromEvent, of } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
})
export class AppComponent {
  users = [
    { id: '1', name: 'John', age: 30 },
    { id: '2', name: 'Jack', age: 35 },
    { id: '3', name: 'Mike', age: 25 },
  ];
  constructor() {
    const numbers$ = of([1, 2, 3, 4]).subscribe((data) => {
      console.log(data); //[1, 2, 3, 4] - конвертує передане значення в Observable
    });

    const numbers1$ = from([1, 2, 3, 4]).subscribe((data) => {
      console.log(data); //1, 2, 3, 4  - конвертує передане значення (Array, Promise, Iterable) в Observable і повертає значення один за одним
    });
    
    const messagePromise = new Promise((resolve) => {
      setTimeout(() => {
        resolve('Promise resolved');
      }, 1000);
    });

    const users$ = of(this.users); 
    const message$ = from(messagePromise); 
    const bodyClick$ = fromEvent(document, 'click');
    
    // Subscribing with  Happy path callback
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
    })
  }
}
