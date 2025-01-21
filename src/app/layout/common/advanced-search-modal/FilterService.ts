import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  private filterSubject = new BehaviorSubject<any>(null);
  filter$ = this.filterSubject.asObservable();

  updateFilters(filters: any): void {
    this.filterSubject.next(filters);
  }
}
