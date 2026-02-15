// import { NgModule } from '@angular/core';
// import { RouterModule, Routes } from '@angular/router';

// const routes: Routes = [];

// @NgModule({
//   imports: [RouterModule.forRoot(routes)],
//   exports: [RouterModule]
// })
// export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  //{ path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'map',
    loadComponent: () => import('./components/map-view/map-view.component').then(m => m.MapViewComponent)
  },
  {
    path: 'events',
    loadComponent: () => import('./components/event-table/event-table.component').then(m => m.EventTableComponent)
  },
  {
    path: 'events/new',
    loadComponent: () => import('./components/event-form/event-form.component').then(m => m.EventFormComponent)
  },
  {
    path: 'model-summary',
    loadComponent: () => import('./components/model-summary/model-summary.component').then(m => m.ModelSummaryComponent)
  },
  { path: '**', redirectTo: '/dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
