import { Component } from '@angular/core';
import { concatMap, map, of } from 'rxjs';

@Component({
  selector: 'app-observables-hell',
  standalone: true,
  imports: [],
  templateUrl: './observables-hell.component.html',
})
export class ObservablesHellComponent {
  id = '1';

  getUser(id: string) {
    return of({ id, name: 'John', slug: 'johnny' });
  }

  getDetail(slug: string) {
    return of({
      age: 30,
      status: 'active',
    });
  }

  message$ = this.getUser(this.id)
    .pipe(
      concatMap((user) => {
        return this.getDetail(user.slug).pipe(
          map((userDetail) => {
            return `${user.name} of age ${userDetail.age} is ${userDetail.status}`;
          })
        );
      })
    )
    .subscribe((message) => {
      // return console.log(message);
    });

  constructor() {
    // this.getUser(this.id).subscribe((user) => {
    //   this.getDetail(user.slug).subscribe((detail) => {
    //     console.log(`${user.name} of age ${detail.age} is ${detail.status}`);
    //   });
    // })
  }
}
