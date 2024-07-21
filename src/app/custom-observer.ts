import { Observer } from 'rxjs';

export class CustomObserver implements Observer<number> {
  next(value: number): void {
    console.log(value);
  }
  error(error: string): void {
    console.log(error);
  }
  complete(): void {
    console.log('complete');
  }
}

//Створити свій власний Observer може бути потрібно коли ми хочемо мати спільну для кількох місць логіку для обробки Observable