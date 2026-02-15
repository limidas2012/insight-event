

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from './pages/api/auth.service.service';
import { User, Permission } from './pages/api/event.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Insight Events Platform';
  currentUser: User | null = null;
  Permission = Permission;

  constructor(
    public authService: AuthService,
    private router: Router
  ) {
    this.authService.currentUser.subscribe(user => {
      //this.currentUser = user;
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  hasPermission(permission: Permission): boolean {
    //return this.authService.hasPermission(permission);
    return true
  }
}



