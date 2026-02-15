// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-dashboard',
//   templateUrl: './dashboard.component.html',
//   styleUrls: ['./dashboard.component.scss']
// })
// export class DashboardComponent {

// }

/*
import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventService } from '../../pages/api/event.service.service';
import { DashboardStats, EventFilters, EventCategory, EventSeverity } from '../../pages/api/event.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('categoryChart') categoryChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('severityChart') severityChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('trendChart') trendChartRef!: ElementRef<HTMLCanvasElement>;

  stats: DashboardStats | null = null;
  loading = true;
  filters: EventFilters = {
    quickDateRange: 'last7days'
  };

  categoryChart?: Chart;
  severityChart?: Chart;
  trendChart?: Chart;

  private destroy$ = new Subject<void>();

  EventCategory = EventCategory;
  EventSeverity = EventSeverity;

  selectedCategories: EventCategory[] = [];
  selectedSeverities: EventSeverity[] = [];

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.loadStats();
  }

  ngAfterViewInit(): void {
    // Charts will be created after data is loaded
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.destroyCharts();
  }

  loadStats(): void {
    this.loading = true;
    this.eventService
      .getDashboardStats(this.filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (stats) => {
          this.stats = stats;
          this.loading = false;
          setTimeout(() => this.createCharts(), 100);
        },
        error: (err) => {
          console.error('Error loading stats:', err);
          this.loading = false;
        }
      });
  }

  applyFilters(): void {
    this.filters = {
      ...this.filters,
      category: this.selectedCategories.length > 0 ? this.selectedCategories : undefined,
      severity: this.selectedSeverities.length > 0 ? this.selectedSeverities : undefined
    };
    this.destroyCharts();
    this.loadStats();
  }

  onQuickDateChange(): void {
    this.destroyCharts();
    this.loadStats();
  }

  toggleCategory(category: EventCategory): void {
    const index = this.selectedCategories.indexOf(category);
    if (index > -1) {
      this.selectedCategories.splice(index, 1);
    } else {
      this.selectedCategories.push(category);
    }
  }

  toggleSeverity(severity: EventSeverity): void {
    const index = this.selectedSeverities.indexOf(severity);
    if (index > -1) {
      this.selectedSeverities.splice(index, 1);
    } else {
      this.selectedSeverities.push(severity);
    }
  }

  private createCharts(): void {
    if (!this.stats) return;

    this.createCategoryChart();
    this.createSeverityChart();
    this.createTrendChart();
  }

  private createCategoryChart(): void {
    if (!this.categoryChartRef || !this.stats) return;

    const ctx = this.categoryChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    this.categoryChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: this.stats.eventsByCategory.map(item => item.category),
        datasets: [{
          data: this.stats.eventsByCategory.map(item => item.count),
          backgroundColor: [
            '#667eea',
            '#764ba2',
            '#f093fb',
            '#4facfe',
            '#43e97b',
            '#fa709a'
          ],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              font: {
                size: 12,
                family: "'Inter', sans-serif"
              }
            }
          }
        }
      }
    });
  }

  private createSeverityChart(): void {
    if (!this.severityChartRef || !this.stats) return;

    const ctx = this.severityChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const severityColors: Record<string, string> = {
      'Critical': '#dc2626',
      'High': '#f59e0b',
      'Medium': '#3b82f6',
      'Low': '#10b981',
      'Info': '#6b7280'
    };

    this.severityChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.stats.eventsBySeverity.map(item => item.severity),
        datasets: [{
          label: 'Events',
          data: this.stats.eventsBySeverity.map(item => item.count),
          backgroundColor: this.stats.eventsBySeverity.map(item => severityColors[item.severity] || '#667eea'),
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0
            }
          }
        }
      }
    });
  }

  private createTrendChart(): void {
    if (!this.trendChartRef || !this.stats) return;

    const ctx = this.trendChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    this.trendChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.stats.trendData.map(item => {
          const date = new Date(item.date);
          return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }),
        datasets: [{
          label: 'Events',
          data: this.stats.trendData.map(item => item.count),
          borderColor: '#667eea',
          backgroundColor: 'rgba(102, 126, 234, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0
            }
          }
        }
      }
    });
  }

  private destroyCharts(): void {
    if (this.categoryChart) {
      this.categoryChart.destroy();
      this.categoryChart = undefined;
    }
    if (this.severityChart) {
      this.severityChart.destroy();
      this.severityChart = undefined;
    }
    if (this.trendChart) {
      this.trendChart.destroy();
      this.trendChart = undefined;
    }
  }

  getSeverityClass(severity: string): string {
    const severityMap: Record<string, string> = {
      'Critical': 'severity-critical',
      'High': 'severity-high',
      'Medium': 'severity-medium',
      'Low': 'severity-low',
      'Info': 'severity-info'
    };
    return severityMap[severity] || '';
  }

  getAvgEventsPerDay(){

  }

  getCriticalHighCount(){
    
  }
}*/



import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventService } from '../../pages/api/event.service.service';
import { DashboardStats, EventFilters, EventCategory, EventSeverity } from '../../pages/api/event.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Chart, registerables } from 'chart.js';
import { Router } from '@angular/router';


Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('categoryChart') categoryChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('severityChart') severityChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('trendChart') trendChartRef!: ElementRef<HTMLCanvasElement>;

  stats: DashboardStats | null = null;
  loading = true;
  filters: EventFilters = {
    quickDateRange: 'last7days'
  };

  categoryChart?: Chart;
  severityChart?: Chart;
  trendChart?: Chart;

  private destroy$ = new Subject<void>();

  EventCategory = EventCategory;
  EventSeverity = EventSeverity;

  selectedCategories: EventCategory[] = [];
  selectedSeverities: EventSeverity[] = [];

  constructor(private eventService: EventService,private router: Router) {}

  ngOnInit(): void {
    this.loadStats();
  }

  ngAfterViewInit(): void {
    // Charts will be created after data is loaded
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.destroyCharts();
  }

  loadStats(): void {
    this.loading = true;
    this.eventService
      .getDashboardStats(this.filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (stats) => {
          this.stats = stats;
          this.loading = false;
          setTimeout(() => this.createCharts(), 100);
        },
        error: (err) => {
          console.error('Error loading stats:', err);
          this.loading = false;
        }
      });
  }

  applyFilters(): void {
    this.filters = {
      ...this.filters,
      category: this.selectedCategories.length > 0 ? this.selectedCategories : undefined,
      severity: this.selectedSeverities.length > 0 ? this.selectedSeverities : undefined
    };
    this.destroyCharts();
    this.loadStats();
  }

  onQuickDateChange(): void {
    this.destroyCharts();
    this.loadStats();
  }

  toggleCategory(category: EventCategory): void {
    const index = this.selectedCategories.indexOf(category);
    if (index > -1) {
      this.selectedCategories.splice(index, 1);
    } else {
      this.selectedCategories.push(category);
    }
  }

  toggleSeverity(severity: EventSeverity): void {
    const index = this.selectedSeverities.indexOf(severity);
    if (index > -1) {
      this.selectedSeverities.splice(index, 1);
    } else {
      this.selectedSeverities.push(severity);
    }
  }

  private createCharts(): void {
    if (!this.stats) return;

    this.createCategoryChart();
    this.createSeverityChart();
    this.createTrendChart();
  }

  private createCategoryChart(): void {
    if (!this.categoryChartRef || !this.stats) return;

    const ctx = this.categoryChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    this.categoryChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: this.stats.eventsByCategory.map(item => item.category),
        datasets: [{
          data: this.stats.eventsByCategory.map(item => item.count),
          backgroundColor: [
            '#667eea',
            '#764ba2',
            '#f093fb',
            '#4facfe',
            '#43e97b',
            '#fa709a'
          ],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              font: {
                size: 12,
                family: "'Inter', sans-serif"
              }
            }
          }
        }
      }
    });
  }

  private createSeverityChart(): void {
    if (!this.severityChartRef || !this.stats) return;

    const ctx = this.severityChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const severityColors: Record<string, string> = {
      'Critical': '#dc2626',
      'High': '#f59e0b',
      'Medium': '#3b82f6',
      'Low': '#10b981',
      'Info': '#6b7280'
    };

    this.severityChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.stats.eventsBySeverity.map(item => item.severity),
        datasets: [{
          label: 'Events',
          data: this.stats.eventsBySeverity.map(item => item.count),
          backgroundColor: this.stats.eventsBySeverity.map(item => severityColors[item.severity] || '#667eea'),
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0
            }
          }
        }
      }
    });
  }

  private createTrendChart(): void {
    if (!this.trendChartRef || !this.stats) return;

    const ctx = this.trendChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    this.trendChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.stats.trendData.map(item => {
          const date = new Date(item.date);
          return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }),
        datasets: [{
          label: 'Events',
          data: this.stats.trendData.map(item => item.count),
          borderColor: '#667eea',
          backgroundColor: 'rgba(102, 126, 234, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0
            }
          }
        }
      }
    });
  }

  private destroyCharts(): void {
    if (this.categoryChart) {
      this.categoryChart.destroy();
      this.categoryChart = undefined;
    }
    if (this.severityChart) {
      this.severityChart.destroy();
      this.severityChart = undefined;
    }
    if (this.trendChart) {
      this.trendChart.destroy();
      this.trendChart = undefined;
    }
  }

  getSeverityClass(severity: string): string {
    const severityMap: Record<string, string> = {
      'Critical': 'severity-critical',
      'High': 'severity-high',
      'Medium': 'severity-medium',
      'Low': 'severity-low',
      'Info': 'severity-info'
    };
    return severityMap[severity] || '';
  }

  getCriticalHighCount(): number {
    if (!this.stats) return 0;
    return this.stats.eventsBySeverity
      .filter((s: any) => s.severity === 'Critical' || s.severity === 'High')
      .reduce((sum: number, s: any) => sum + s.count, 0);
  }

  getAvgEventsPerDay(): string {
    if (!this.stats || this.stats.trendData.length === 0) return '0';
    const total = this.stats.trendData.reduce((sum: number, d: any) => sum + d.count, 0);
    return (total / this.stats.trendData.length).toFixed(1);
  }

  logout(){
    this.router.navigate(['/login']);
  }
}

