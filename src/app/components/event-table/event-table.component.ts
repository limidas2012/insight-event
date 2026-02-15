// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-event-table',
//   templateUrl: './event-table.component.html',
//   styleUrls: ['./event-table.component.scss']
// })
// export class EventTableComponent {

// }




import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { EventService } from '../../pages/api/event.service.service';
import { InsightEvent, EventFilters, EventCategory, EventSeverity, PaginationParams } from '../../pages/api/event.model';

@Component({
  selector: 'app-event-table',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './event-table.component.html',
  styleUrls: ['./event-table.component.scss']
})
export class EventTableComponent implements OnInit {
  events: InsightEvent[] = [];
  totalEvents = 0;
  loading = true;
  searchQuery = '';

  filters: EventFilters = {
    quickDateRange: 'last30days'
  };

  pagination: PaginationParams = {
    page: 1,
    pageSize: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  };

  EventCategory = EventCategory;
  EventSeverity = EventSeverity;

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.loading = true;
    const searchFilters = {
      ...this.filters,
      searchQuery: this.searchQuery || undefined
    };

    this.eventService.getPaginatedEvents(searchFilters, this.pagination).subscribe({
      next: (result) => {
        this.events = result.events;
        this.totalEvents = result.total;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading events:', err);
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    this.pagination.page = 1;
    this.loadEvents();
  }

  onSort(column: string): void {
    if (this.pagination.sortBy === column) {
      this.pagination.sortOrder = this.pagination.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.pagination.sortBy = column;
      this.pagination.sortOrder = 'desc';
    }
    this.loadEvents();
  }

  onPageChange(page: number): void {
    this.pagination.page = page;
    this.loadEvents();
  }

  get totalPages(): number {
    return Math.ceil(this.totalEvents / this.pagination.pageSize);
  }

  get pages(): number[] {
    const maxVisible = 5;
    const halfVisible = Math.floor(maxVisible / 2);
    let start = Math.max(1, this.pagination.page - halfVisible);
    let end = Math.min(this.totalPages, start + maxVisible - 1);
    
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  getSeverityClass(severity: EventSeverity): string {
    const classes: Record<EventSeverity, string> = {
      [EventSeverity.CRITICAL]: 'severity-critical',
      [EventSeverity.HIGH]: 'severity-high',
      [EventSeverity.MEDIUM]: 'severity-medium',
      [EventSeverity.LOW]: 'severity-low',
      [EventSeverity.INFO]: 'severity-info'
    };
    return classes[severity] || '';
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
