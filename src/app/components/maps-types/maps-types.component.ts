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
      from([0, 1, 2, 3, 4]) //? first is outer Observable
        .pipe(
          operator(
            (x: any) => of(x).pipe(delay(1000)) //? second is inner Observable
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
    //! from() ітерує значення в масиві і для кожного значення повертає новий Observable

    //! mergeMap()
    // example(mergeMap)(); //? Map to Observable, emit values. Внутрішній і зовнішній Observables не блокують виконання один одного, тобто значення з зовнішнього попадають у внутрішній одразу по мірі їх створення і внутрішній починає працювати одразу ж як отримав перше значення з зовнішнього стріма. Тобто по суті вони відпрацьовують паралельно.
    // 0, 1, 2, 3, 4, mergeMap completed - з затримкою в 3 секунди отримаємо одразу всі значення

    //! concatMap()
    // example(concatMap)(); //? Map values to inner observable, subscribe and emit in order. Оператор чекає на завершення кожного зі створених Observables. Тобто контролюватиме, щоб внутрішній Observable чекав на завершення виконання зовнішнього і навпаки. Тобто по суті observables відпрацьовують в порядку створення, один за одним.
    //? Приклад використання це 2 апі запита де для другого запита (inner observable) нам потрібні дані з першого (outer observable)
    // 0, 1, 2, 3, 4, concatMap completed - з затримкою в 3 секунди між кожним значенням отримаємо всі значення

    //! switchMap()
    // example(switchMap)(); //? Map to observable, complete previous inner observable, emit values.
    //? Оператор чекає поки повністю завершиться зовнішній Observable і лише тоді його останнє значення передається у внутрішній Observable
    // 4, switchMap completed - з затримкою в 3 секунди отримаємо останнє значення

    //! exhaustMap()
    // example(exhaustMap)(); //? Map to inner observable, ignore other values until that observable completes. All next observables are ignored until observable will not be completed. Як тільки зовнішній observable згенерував значення, внутрішній одразу ж почне виконуватися і поки він не завершиться, навіть якщо зовнішній продовжить емітити нові значення, вони будуть просто ігноруватися.
    //? Приклад використання це ігнорування кліків на кнопку, яка робить якийсь запит на сервер, доки цей запит не завершиться
    // 0, exhaustMap completed - з затримкою в 3 секунди отримаємо перше значення
  }
}
