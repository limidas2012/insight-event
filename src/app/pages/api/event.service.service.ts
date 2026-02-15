// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class EventServiceService {

//   constructor() { }
// }

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import {
  InsightEvent,
  EventCategory,
  EventSeverity,
  EventFilters,
  DashboardStats,
  PaginationParams
} from '../api/event.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private eventsSubject = new BehaviorSubject<InsightEvent[]>([]);
  public events$ = this.eventsSubject.asObservable();

  private mockEvents: InsightEvent[] = [];

  constructor() {
    this.generateMockEvents();
    this.eventsSubject.next(this.mockEvents);
  }

  private generateMockEvents(): void {
    const categories = Object.values(EventCategory);
    const severities = Object.values(EventSeverity);
    const titles = [
      'Database Connection Pool Exhausted',
      'Unusual Login Activity Detected',
      'API Response Time Degradation',
      'Security Certificate Expiring Soon',
      'Disk Space Threshold Exceeded',
      'Failed Payment Transaction Spike',
      'Memory Usage Critical',
      'Suspicious Network Traffic',
      'Compliance Audit Failed',
      'Customer Churn Rate Increased',
      'Service Outage Detected',
      'Infrastructure Scaling Event',
      'Authentication Failure Spike',
      'Data Pipeline Delay',
      'Third-Party API Down'
    ];

    const impacts = [
      'Revenue impact estimated at $50K',
      'Affecting 1,200 users',
      'Service degradation in US-EAST region',
      'Potential security breach',
      'SLA violation risk',
      'Customer satisfaction impact',
      'Operational efficiency reduced by 30%',
      'Compliance risk identified'
    ];

    for (let i = 0; i < 150; i++) {
      const daysAgo = Math.floor(Math.random() * 60);
      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - daysAgo);

      const category = categories[Math.floor(Math.random() * categories.length)];
      const severity = severities[Math.floor(Math.random() * severities.length)];

      this.mockEvents.push({
        id: `event-${i + 1}`,
        title: titles[Math.floor(Math.random() * titles.length)],
        description: `Automated alert triggered by predictive model. Confidence score indicates ${severity.toLowerCase()} priority attention required.`,
        category,
        severity,
        score: Math.floor(Math.random() * 100),
        latitude: 37.7749 + (Math.random() - 0.5) * 10,
        longitude: -122.4194 + (Math.random() - 0.5) * 20,
        tags: this.generateTags(category),
        createdAt,
        impact: Math.random() > 0.5 ? impacts[Math.floor(Math.random() * impacts.length)] : undefined,
        metadata: {
          source: 'AI Model v2.1',
          confidence: Math.floor(Math.random() * 30) + 70,
          region: ['US-EAST', 'US-WEST', 'EU-CENTRAL', 'APAC'][Math.floor(Math.random() * 4)]
        }
      });
    }
  }

  private generateTags(category: EventCategory): string[] {
    const tagMap: Record<EventCategory, string[]> = {
      [EventCategory.OPERATIONS]: ['automation', 'monitoring', 'alerting', 'incident'],
      [EventCategory.SECURITY]: ['threat', 'vulnerability', 'access-control', 'encryption'],
      [EventCategory.PERFORMANCE]: ['latency', 'throughput', 'optimization', 'bottleneck'],
      [EventCategory.COMPLIANCE]: ['audit', 'policy', 'regulation', 'governance'],
      [EventCategory.INFRASTRUCTURE]: ['cloud', 'scaling', 'capacity', 'deployment'],
      [EventCategory.CUSTOMER]: ['engagement', 'retention', 'satisfaction', 'experience']
    };

    const categoryTags = tagMap[category] || [];
    const numTags = Math.floor(Math.random() * 3) + 1;
    return categoryTags.slice(0, numTags);
  }

  getEvents(filters?: EventFilters): Observable<InsightEvent[]> {
    return of(this.mockEvents).pipe(
      delay(300),
      map(events => this.applyFilters(events, filters))
    );
  }

  getEventById(id: string): Observable<InsightEvent | undefined> {
    return of(this.mockEvents.find(e => e.id === id)).pipe(delay(200));
  }

  createEvent(event: Omit<InsightEvent, 'id' | 'createdAt'>): Observable<InsightEvent> {
    const newEvent: InsightEvent = {
      ...event,
      id: `event-${Date.now()}`,
      createdAt: new Date()
    };
    this.mockEvents.unshift(newEvent);
    this.eventsSubject.next(this.mockEvents);
    return of(newEvent).pipe(delay(300));
  }

  updateEvent(id: string, updates: Partial<InsightEvent>): Observable<InsightEvent> {
    const index = this.mockEvents.findIndex(e => e.id === id);
    if (index !== -1) {
      this.mockEvents[index] = { ...this.mockEvents[index], ...updates };
      this.eventsSubject.next(this.mockEvents);
      return of(this.mockEvents[index]).pipe(delay(300));
    }
    throw new Error('Event not found');
  }

  deleteEvent(id: string): Observable<void> {
    this.mockEvents = this.mockEvents.filter(e => e.id !== id);
    this.eventsSubject.next(this.mockEvents);
    return of(void 0).pipe(delay(300));
  }

  private applyFilters(events: InsightEvent[], filters?: EventFilters): InsightEvent[] {
    if (!filters) return events;

    let filtered = [...events];

    if (filters.category && filters.category.length > 0) {
      filtered = filtered.filter(e => filters.category!.includes(e.category));
    }

    if (filters.severity && filters.severity.length > 0) {
      filtered = filtered.filter(e => filters.severity!.includes(e.severity));
    }

    if (filters.minScore !== undefined) {
      filtered = filtered.filter(e => e.score >= filters.minScore!);
    }

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(e =>
        e.title.toLowerCase().includes(query) ||
        e.description.toLowerCase().includes(query) ||
        e.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    if (filters.quickDateRange) {
      const now = new Date();
      const days = filters.quickDateRange === 'last7days' ? 7 : 30;
      const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(e => new Date(e.createdAt) >= startDate);
    } else if (filters.dateRange) {
      filtered = filtered.filter(e => {
        const eventDate = new Date(e.createdAt);
        return eventDate >= filters.dateRange!.start && eventDate <= filters.dateRange!.end;
      });
    }

    return filtered;
  }

  getDashboardStats(filters?: EventFilters): Observable<DashboardStats> {
    return this.getEvents(filters).pipe(
      map(events => {
        const stats: DashboardStats = {
          totalEvents: events.length,
          eventsByCategory: this.groupByCategory(events),
          eventsBySeverity: this.groupBySeverity(events),
          trendData: this.calculateTrend(events),
          insights: this.generateInsights(events, filters)
        };
        return stats;
      })
    );
  }

  private groupByCategory(events: InsightEvent[]): { category: string; count: number }[] {
    const groups = events.reduce((acc, event) => {
      acc[event.category] = (acc[event.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(groups).map(([category, count]) => ({ category, count }));
  }

  private groupBySeverity(events: InsightEvent[]): { severity: string; count: number }[] {
    const groups = events.reduce((acc, event) => {
      acc[event.severity] = (acc[event.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(groups).map(([severity, count]) => ({ severity, count }));
  }

  private calculateTrend(events: InsightEvent[]): { date: string; count: number }[] {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return date.toISOString().split('T')[0];
    });

    const eventsByDate = events.reduce((acc, event) => {
      const date = new Date(event.createdAt).toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return last30Days.map(date => ({
      date,
      count: eventsByDate[date] || 0
    }));
  }

  private generateInsights(events: InsightEvent[], filters?: EventFilters): string[] {
    const insights: string[] = [];

    // Calculate previous period for comparison
    const currentPeriod = events;
    const previousPeriodEvents = this.getPreviousPeriodEvents(filters);

    // Severity change insight
    const highSeverityCurrent = currentPeriod.filter(e =>
      e.severity === EventSeverity.CRITICAL || e.severity === EventSeverity.HIGH
    ).length;
    const highSeverityPrevious = previousPeriodEvents.filter(e =>
      e.severity === EventSeverity.CRITICAL || e.severity === EventSeverity.HIGH
    ).length;

    if (highSeverityPrevious > 0) {
      const change = ((highSeverityCurrent - highSeverityPrevious) / highSeverityPrevious * 100).toFixed(0);
      insights.push(`High severity events ${Number(change) >= 0 ? 'increased' : 'decreased'} by ${Math.abs(Number(change))}% vs previous period`);
    }

    // Top category insight
    const categoryGroups = this.groupByCategory(currentPeriod);
    if (categoryGroups.length > 0) {
      const topCategory = categoryGroups.reduce((max, cat) => cat.count > max.count ? cat : max);
      insights.push(`Top category this period: ${topCategory.category} (${topCategory.count} events)`);
    }

    // Highest impact event
    const highImpactEvent = currentPeriod
      .filter(e => e.impact && (e.severity === EventSeverity.CRITICAL || e.severity === EventSeverity.HIGH))
      .sort((a, b) => b.score - a.score)[0];

    if (highImpactEvent) {
      insights.push(`Highest impact event: ${highImpactEvent.title} (Score: ${highImpactEvent.score})`);
    }

    return insights;
  }

  private getPreviousPeriodEvents(filters?: EventFilters): InsightEvent[] {
    if (!filters?.quickDateRange) return [];

    const days = filters.quickDateRange === 'last7days' ? 7 : 30;
    const now = new Date();
    const previousStart = new Date(now.getTime() - days * 2 * 24 * 60 * 60 * 1000);
    const previousEnd = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    return this.mockEvents.filter(e => {
      const eventDate = new Date(e.createdAt);
      return eventDate >= previousStart && eventDate <= previousEnd;
    });
  }

  getPaginatedEvents(
    filters: EventFilters,
    pagination: PaginationParams
  ): Observable<{ events: InsightEvent[]; total: number }> {
    return this.getEvents(filters).pipe(
      map(events => {
        // Sort
        const sorted = [...events].sort((a, b) => {
          const aVal = (a as any)[pagination.sortBy];
          const bVal = (b as any)[pagination.sortBy];

          if (pagination.sortOrder === 'asc') {
            return aVal > bVal ? 1 : -1;
          } else {
            return aVal < bVal ? 1 : -1;
          }
        });

        // Paginate
        const start = (pagination.page - 1) * pagination.pageSize;
        const end = start + pagination.pageSize;
        const paginatedEvents = sorted.slice(start, end);

        return {
          events: paginatedEvents,
          total: sorted.length
        };
      })
    );
  }
}
