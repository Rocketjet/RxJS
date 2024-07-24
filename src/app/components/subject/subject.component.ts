import { Component, OnInit } from '@angular/core';
import { User } from '../../interfaces/user.interface';
import { BehaviorSubject, Observable, ReplaySubject, Subject, tap } from 'rxjs';

@Component({
  selector: 'app-subject',
  standalone: true,
  imports: [],
  templateUrl: './subject.component.html',
})
export class SubjectComponent implements OnInit {
  users: User[] = [
    { id: '1', name: 'John', age: 30, isActive: true },
    { id: '2', name: 'Jack', age: 35, isActive: false },
    { id: '3', name: 'Mike', age: 25, isActive: true },
    { id: '3', name: 'Monika', age: 25, isActive: true },
  ];

  subject$ = new Subject<User[]>();
  behaviorSubject$ = new BehaviorSubject<User[]>([]);

  constructor() {
    //! Subject()
    this.subject$.subscribe((value) => {
      // console.log(value);
    }); // отримаємо дані, які було додано в стрім нижче
    this.subject$.next(this.users);

    //! BehaviorSubject()
    //? Відрізняється від Subject тим, що потребує початкового значення і може надавати його підписникам незалежно від того, коли вони підписались на нього.
    //? Також це значення можна отримати напряму через getValue()
    this.behaviorSubject$.subscribe((value) => {
      // console.log(value);
    }); // спочатку тут буде [], потім вже відповідні дані надані в next()
    this.behaviorSubject$.next(this.users);
    const value = this.behaviorSubject$.getValue();
    // console.log(value); //отримаємо наших юзерів
  }

  ngOnInit(): void {
    //? Різниця в тому, як працюють різни типи Subject
    //! Observable()
    const observable$ = new Observable((observer) => {
      observer.next(1);

      setTimeout(() => {
        observer.next(2);
        observer.next(3);
      }, 3000);
    });
    observable$.subscribe((value) => {
      // console.log('observable observer 1', value);
    });
    observable$.subscribe((value) => {
      // console.log('observable observer 2', value)
    });
    //? Обидва підписники отримають всі згенеровані дані

    //! Subject()
    const subject$ = new Subject();
    subject$.next(1);

    subject$.subscribe((value) => {
      // console.log('subject observer 1', value);
    });

    setTimeout(() => {
      subject$.next(2);
      subject$.next(3);

      subject$.subscribe((value) => {
        // console.log('subject observer 2', value);
      });
    }, 3000);
    subject$.next(4);
    //? В 1 підписку попадуть значення, згенеровані після активації підписки
    //? В 2 підписку не попаде нічого, бо не було згенеровано нових значень після активації
    // subject observer 1 4
    // subject observer 1 2
    // subject observer 1 3

    //! BehaviorSubject()
    const behaviorSubject$ = new BehaviorSubject(0);
    behaviorSubject$.next(1);

    behaviorSubject$.subscribe((value) => {
      // console.log('behaviorSubject observer 1', value)
    });

    setTimeout(() => {
      behaviorSubject$.next(2);
      behaviorSubject$.next(3);

      behaviorSubject$.subscribe((value) => {
        // console.log('behaviorSubject observer 2', value);
      });
    }, 3000);
    behaviorSubject$.next(4);
    //? В 1 підписку попаде дефолтне значення, яке одразу ж буде перезаписане на 1 і далі всі наступні згенеровані значення
    //? В 2 підписку попаде лише останнє згенероване значення
    // behaviorSubject observer 1 1
    // behaviorSubject observer 1 4
    // behaviorSubject observer 1 2
    // behaviorSubject observer 1 3
    // behaviorSubject observer 2 3

    //! ReplaySubject()
    const replaySubject$ = new ReplaySubject();
    replaySubject$.next(1);

    replaySubject$.subscribe((value) => {
      // console.log('replaySubject observer 1', value);
    });

    setTimeout(() => {
      replaySubject$.next(2);
      replaySubject$.next(3);

      replaySubject$.subscribe((value) => {
        // console.log('replaySubject observer 2', value);
      });
    }, 3000);
    replaySubject$.next(4);
    //? Цей тип Subject буде емітити всі згенеровані значення для всіх підписників, неважливо коли ці значення були згенеровані
    //? Поведінка схожа на ту, коли новий користувач додається в чат і отримує одразу всю історію повідомлень
    // replaySubject observer 1 1
    // replaySubject observer 1 4
    // replaySubject observer 1 2
    // replaySubject observer 1 3
    // replaySubject observer 2 1
    // replaySubject observer 2 4
    // replaySubject observer 2 2
    // replaySubject observer 2 3
  }
}
