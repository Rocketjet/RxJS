import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import {
  debounce,
  debounceTime,
  interval,
  throttle,
  throttleTime,
  timer,
} from 'rxjs';

@Component({
  selector: 'app-debounce',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule],
  templateUrl: './debounce.component.html',
})
export class DebounceComponent {
  fb = inject(NonNullableFormBuilder);
  searchForm = this.fb.group({
    searchValue: '',
  });

  constructor() {
    //! debounce() - Discard emitted values that take less than the specified time, based on selector function, between output.
    interval(1000)
      .pipe(debounce((val) => timer(val * 200)))
      .subscribe((value) => {
        // console.log(value);
      });
    //! debounceTime() - Discard emitted values that take less than the specified time between output
    this.searchForm
      .get('searchValue')
      ?.valueChanges.pipe(debounceTime(500))
      .subscribe((value) => {
        // console.log('debounced value', value);
      });
    //? чекатиме вказаний час після останнього в стрімі значення і лише після відбудеться підписка. Якщо в проміжку очікування в стрім попаде нове значення, таймер обнулиться

    //! throttle() - Emit value on the leading edge of an interval, but suppress new values until durationSelector has completed.
    // interval(1000)
    //   .pipe(throttle((val) => timer(val * 200)))
    //   .subscribe((value) => {
    //     console.log('increased throttle', value);
    //   });
    //! throttleTime() - Emit first value then ignore for specified duration
    this.searchForm
      .get('searchValue')
      ?.valueChanges.pipe(throttleTime(1000))
      .subscribe((value) => {
        // console.log('search change -> Call API', value);
      });
    //? генерує значення спочатку одразу ж і потім блокує нові значення на вказаний час
  }

  onSearchSubmit() {
    console.log('onSearchSubmit');
  }
}
