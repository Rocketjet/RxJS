import { Component, OnInit } from '@angular/core';
import {
  concatMap,
  delay,
  exhaustMap,
  from,
  mergeMap,
  of,
  switchMap,
} from 'rxjs';

@Component({
  selector: 'app-maps-types',
  standalone: true,
  imports: [],
  templateUrl: './maps-types.component.html',
})
export class MapsTypesComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    const example = (operator: any) => () => {
      from([0, 1, 2, 3, 4]) //? first outer Observable
        .pipe(
          operator(
            (x: any) => of(x).pipe(delay(3000)) //? second inner Observable
          )
        )
        .subscribe({
          next: console.log,
          error: console.error,
          complete: () => {
            console.log(`${operator.name} completed`);
          },
        });
    };
    //! mergeMap()
    // example(mergeMap)(); //? Map to Observable, emit values, не чекає за завершення попереднього Observable
    // 0, 1, 2, 3, 4, mergeMap completed - з затримкою в 3 секунди отримаємо одразу всі значення

    //! concatMap()
    // example(concatMap)(); //? Map values to inner observable, subscribe and emit in order, чекає за завершення попереднього Observable
    // 0, 1, 2, 3, 4, concatMap completed - з затримкою в 3 секунди між кожним значенням отримаємо одразу всі значення

    //! switchMap()
    // example(switchMap)(); //? Map to observable, complete previous inner observable, emit values.
    // 4, switchMap completed - з затримкою в 3 секунди отримаємо останнє значення

    //! exhaustMap()
    // example(exhaustMap)(); //? Map to inner observable, ignore other values until that observable completes.
    // 0, exhaustMap completed - з затримкою в 3 секунди отримаємо перше значення
  }
}
