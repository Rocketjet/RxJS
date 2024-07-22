import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { filter, map, Observable } from 'rxjs';
import { BackendState } from '../../interfaces/backend-state.interface';
import { State } from '../../interfaces/state.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-filter-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './filter-map.component.html',
})
export class FilterMapComponent {
  http = inject(HttpClient);
  backendState$: Observable<BackendState | null> = new Observable(
    (observer) => {
      observer.next(null);

      setTimeout(() => {
        observer.next({
          api_url: 'http:// localhost:3004',
          real_views: 1000,
          roles: ['admin', 'dev'],
        });
      }, 2000);
    }
  );

  state$: Observable<State> = this.backendState$.pipe(
    filter(Boolean), //таким чином відфільтровуємо всі falsy значення
    map((backendState) => {
      return {
        apiUrl: backendState.api_url,
        realViews: backendState.real_views,
        roles: backendState.roles,
      };
    })
  );
}
