// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class InsightEventService {

//   constructor() { }
// }


import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { InsightEvent } from '../model/insight-event';
import { AuthService } from '../pages/api/auth.service.service';

@Injectable({
  providedIn: 'root'
})
export class InsightEventService {
  private mockEvents: InsightEvent[] = [
    {
      id: '1',
      title: 'Q4 Revenue Analysis',
      description: 'Analysis of Q4 revenue trends and patterns',
      createdAt: new Date('2024-01-15'),
      createdBy: 'admin@test.com'
    },
    {
      id: '2',
      title: 'Customer Churn Insights',
      description: 'Key insights into customer churn patterns',
      createdAt: new Date('2024-01-20'),
      createdBy: 'analyst@test.com'
    },
    {
      id: '3',
      title: 'Market Trends Report',
      description: 'Latest market trends and predictions',
      createdAt: new Date('2024-02-01'),
      createdBy: 'admin@test.com'
    }
  ];

  constructor(private authService: AuthService) {}

  getAll(): Observable<InsightEvent[]> {
    return of([...this.mockEvents]).pipe(delay(300));
  }

  getById(id: string): Observable<InsightEvent | undefined> {
    return of(this.mockEvents.find(e => e.id === id)).pipe(delay(200));
  }

  create(event: Omit<InsightEvent, 'id' | 'createdAt' | 'createdBy'>): Observable<InsightEvent> {
    if (!this.authService.canCreateEvent()) {
      return throwError(() => new Error('Unauthorized: Cannot create events'));
    }

    return of(null).pipe(
      delay(300),
      map(() => {
        const newEvent: InsightEvent = {
          ...event,
          id: (this.mockEvents.length + 1).toString(),
          createdAt: new Date(),
          createdBy: this.authService.currentUserValue?.email || 'unknown'
        };
        this.mockEvents.push(newEvent);
        return newEvent;
      })
    );
  }

  update(id: string, event: Partial<InsightEvent>): Observable<InsightEvent> {
    if (!this.authService.canEditEvent()) {
      return throwError(() => new Error('Unauthorized: Cannot edit events'));
    }

    return of(null).pipe(
      delay(300),
      map(() => {
        const index = this.mockEvents.findIndex(e => e.id === id);
        if (index === -1) {
          throw new Error('Event not found');
        }

        this.mockEvents[index] = {
          ...this.mockEvents[index],
          ...event,
          updatedAt: new Date(),
          updatedBy: this.authService.currentUserValue?.email || 'unknown'
        };

        return this.mockEvents[index];
      })
    );
  }

  delete(id: string): Observable<boolean> {
    if (!this.authService.canDeleteEvent()) {
      return throwError(() => new Error('Unauthorized: Cannot delete events'));
    }

    return of(null).pipe(
      delay(300),
      map(() => {
        const index = this.mockEvents.findIndex(e => e.id === id);
        if (index === -1) {
          return false;
        }
        this.mockEvents.splice(index, 1);
        return true;
      })
    );
  }
}
