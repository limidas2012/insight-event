// export class EventModel {
// }

export interface InsightEvent {
    id: string;
    title: string;
    description: string;
    category: EventCategory;
    severity: EventSeverity;
    score: number;
    latitude: number;
    longitude: number;
    tags: string[];
    createdAt: Date;
    impact?: string;
    metadata?: Record<string, any>;
  }
  
  export enum EventCategory {
    OPERATIONS = 'Operations',
    SECURITY = 'Security',
    PERFORMANCE = 'Performance',
    COMPLIANCE = 'Compliance',
    INFRASTRUCTURE = 'Infrastructure',
    CUSTOMER = 'Customer'
  }
  
  export enum EventSeverity {
    CRITICAL = 'Critical',
    HIGH = 'High',
    MEDIUM = 'Medium',
    LOW = 'Low',
    INFO = 'Info'
  }
  
  export interface User {
    id: string;
    username: string;
    email: string;
    role: UserRole;
    permissions: Permission[];
  }
  
  export enum UserRole {
    ADMIN = 'Admin',
    ANALYST = 'Analyst',
    VIEWER = 'Viewer'
  }
  
  export enum Permission {
    VIEW_EVENTS = 'view_events',
    CREATE_EVENTS = 'create_events',
    EDIT_EVENTS = 'edit_events',
    DELETE_EVENTS = 'delete_events',
    VIEW_DASHBOARD = 'view_dashboard',
    MANAGE_USERS = 'manage_users'
  }
  
  export interface EventFilters {
    category?: EventCategory[];
    severity?: EventSeverity[];
    dateRange?: {
      start: Date;
      end: Date;
    };
    quickDateRange?: 'last7days' | 'last30days' | 'custom';
    minScore?: number;
    searchQuery?: string;
  }
  
  export interface DashboardStats {
    totalEvents: number;
    eventsByCategory: { category: string; count: number }[];
    eventsBySeverity: { severity: string; count: number }[];
    trendData: { date: string; count: number }[];
    insights: string[];
  }
  
  export interface PaginationParams {
    page: number;
    pageSize: number;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  }