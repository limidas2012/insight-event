

/*import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
//import { User, UserRole, Permission } from '../models/event.model';
import { User, UserRole, Permission } from '../api/event.model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor() {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string): Observable<User> {
    // Mock login - in production, this would call an API
    return new Observable(observer => {
      setTimeout(() => {
        let user: User;
        
        if (username === 'admin') {
          user = {
            id: '1',
            username: 'admin',
            email: 'admin@example.com',
            role: UserRole.ADMIN,
            permissions: Object.values(Permission)
          };
        } else if (username === 'analyst') {
          user = {
            id: '2',
            username: 'analyst',
            email: 'analyst@example.com',
            role: UserRole.ANALYST,
            permissions: [
              Permission.VIEW_EVENTS,
              Permission.CREATE_EVENTS,
              Permission.EDIT_EVENTS,
              Permission.VIEW_DASHBOARD
            ]
          };
        } else {
          user = {
            id: '3',
            username: 'viewer',
            email: 'viewer@example.com',
            role: UserRole.VIEWER,
            permissions: [Permission.VIEW_EVENTS, Permission.VIEW_DASHBOARD]
          };
        }

        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        observer.next(user);
        observer.complete();
      }, 500);
    });
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  hasPermission(permission: Permission): boolean {
    const user = this.currentUserValue;
    return user ? user.permissions.includes(permission) : false;
  }

  hasRole(role: UserRole): boolean {
    const user = this.currentUserValue;
    return user ? user.role === role : false;
  }
}*/

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { User, AuthUser, UserRole } from '../../model/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<AuthUser | null>;
  public currentUser: Observable<AuthUser | null>;

  // Mock users database
  private mockUsers: User[] = [
    {
      id: '1',
      email: 'admin@test.com',
      password: 'password',
      role: UserRole.ADMIN,
      name: 'Admin User'
    },
    {
      id: '2',
      email: 'analyst@test.com',
      password: 'password',
      role: UserRole.ANALYST,
      name: 'Analyst User'
    },
    {
      id: '3',
      email: 'viewer@test.com',
      password: 'password',
      role: UserRole.VIEWER,
      name: 'Viewer User'
    }
  ];

  constructor() {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<AuthUser | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): AuthUser | null {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string): Observable<AuthUser> {
    // Simulate API delay
    return of(null).pipe(
      delay(500),
      map(() => {
        const user = this.mockUsers.find(
          u => u.email === email && u.password === password
        );

        if (!user) {
          throw new Error('Invalid email or password');
        }

        // Create auth user with token
        const authUser: AuthUser = {
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.name,
          token: this.generateMockToken(user.id)
        };

        // Store user details and jwt token in local storage
        localStorage.setItem('currentUser', JSON.stringify(authUser));
        this.currentUserSubject.next(authUser);

        return authUser;
      })
    );
  }

  logout(): void {
    // Remove user from local storage
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  hasRole(roles: UserRole[]): boolean {
    const user = this.currentUserValue;
    if (!user) return false;
    return roles.includes(user.role);
  }

  canCreateEvent(): boolean {
    return this.hasRole([UserRole.ADMIN, UserRole.ANALYST]);
  }

  canEditEvent(): boolean {
    return this.hasRole([UserRole.ADMIN, UserRole.ANALYST]);
  }

  canDeleteEvent(): boolean {
    return this.hasRole([UserRole.ADMIN]);
  }

  canManageUsers(): boolean {
    return this.hasRole([UserRole.ADMIN]);
  }

  private generateMockToken(userId: string): string {
    return `mock-jwt-token-${userId}-${Date.now()}`;
  }

  // For user management
  getAllUsers(): Observable<User[]> {
    if (!this.canManageUsers()) {
      return throwError(() => new Error('Unauthorized'));
    }
    return of(this.mockUsers.map(u => ({ ...u, password: '***' }))).pipe(delay(300));
  }

  updateUserRole(userId: string, newRole: UserRole): Observable<boolean> {
    if (!this.canManageUsers()) {
      return throwError(() => new Error('Unauthorized'));
    }

    return of(null).pipe(
      delay(300),
      map(() => {
        const user = this.mockUsers.find(u => u.id === userId);
        if (user) {
          user.role = newRole;
          return true;
        }
        return false;
      })
    );
  }
}

