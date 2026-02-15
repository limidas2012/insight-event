// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-map-view',
//   templateUrl: './map-view.component.html',
//   styleUrls: ['./map-view.component.scss']
// })
// export class MapViewComponent {

// }


import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventService } from '../../pages/api/event.service.service';
import { InsightEvent, EventFilters, EventCategory, EventSeverity } from '../../pages/api/event.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as L from 'leaflet';

@Component({
  selector: 'app-map-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss']
})
export class MapViewComponent implements OnInit, OnDestroy, AfterViewInit {
  private map?: L.Map;
  private markers: L.Marker[] = [];
  private destroy$ = new Subject<void>();

  events: InsightEvent[] = [];
  filteredEvents: InsightEvent[] = [];
  selectedEvent: InsightEvent | null = null;
  loading = true;
  showFilters = true;
  searchQuery = '';

  filters: EventFilters = {
    quickDateRange: 'last30days',
    minScore: 0
  };

  EventCategory = EventCategory;
  EventSeverity = EventSeverity;
  categories = Object.values(EventCategory);
  severities = Object.values(EventSeverity);

  selectedCategories: Set<EventCategory> = new Set();
  selectedSeverities: Set<EventSeverity> = new Set();

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.map) {
      this.map.remove();
    }
  }

  private initMap(): void {
    this.map = L.map('map').setView([37.7749, -122.4194], 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // Fix default marker icon issue with webpack
    const iconRetinaUrl = 'assets/marker-icon-2x.png';
    const iconUrl = 'assets/marker-icon.png';
    const shadowUrl = 'assets/marker-shadow.png';
    const iconDefault = L.icon({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41]
    });
    L.Marker.prototype.options.icon = iconDefault;
  }

  loadEvents(): void {
    this.loading = true;
    this.eventService
      .getEvents(this.filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (events) => {
          this.events = events;
          this.applyClientFilters();
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading events:', err);
          this.loading = false;
        }
      });
  }

  applyFilters(): void {
    this.filters = {
      ...this.filters,
      category: this.selectedCategories.size > 0 ? Array.from(this.selectedCategories) : undefined,
      severity: this.selectedSeverities.size > 0 ? Array.from(this.selectedSeverities) : undefined
    };
    this.loadEvents();
  }

  applyClientFilters(): void {
    let filtered = [...this.events];

    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(e =>
        e.title.toLowerCase().includes(query) ||
        e.description.toLowerCase().includes(query) ||
        e.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    this.filteredEvents = filtered;
    this.updateMarkers();
  }

  onSearchChange(): void {
    this.applyClientFilters();
  }

  toggleCategory(category: EventCategory): void {
    if (this.selectedCategories.has(category)) {
      this.selectedCategories.delete(category);
    } else {
      this.selectedCategories.add(category);
    }
  }

  toggleSeverity(severity: EventSeverity): void {
    if (this.selectedSeverities.has(severity)) {
      this.selectedSeverities.delete(severity);
    } else {
      this.selectedSeverities.add(severity);
    }
  }

  private updateMarkers(): void {
    if (!this.map) return;

    // Clear existing markers
    this.markers.forEach(marker => marker.remove());
    this.markers = [];

    // Add new markers
    this.filteredEvents.forEach(event => {
      const marker = L.marker([event.latitude, event.longitude])
        .addTo(this.map!);

      const severityColor = this.getSeverityColor(event.severity);
      const icon = this.createCustomIcon(severityColor);
      marker.setIcon(icon);

      marker.on('click', () => {
        this.selectedEvent = event;
      });

      this.markers.push(marker);
    });

    // Fit bounds if there are markers
    if (this.markers.length > 0) {
      const group = L.featureGroup(this.markers);
      this.map.fitBounds(group.getBounds().pad(0.1));
    }
  }

  private createCustomIcon(color: string): L.DivIcon {
    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });
  }

  private getSeverityColor(severity: EventSeverity): string {
    const colors: Record<EventSeverity, string> = {
      [EventSeverity.CRITICAL]: '#dc2626',
      [EventSeverity.HIGH]: '#f59e0b',
      [EventSeverity.MEDIUM]: '#3b82f6',
      [EventSeverity.LOW]: '#10b981',
      [EventSeverity.INFO]: '#6b7280'
    };
    return colors[severity] || '#667eea';
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

  closePanel(): void {
    this.selectedEvent = null;
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
