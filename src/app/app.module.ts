import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MapComponent } from './map/map.component';
import { EventsComponent } from './events/events.component';
import { UsersComponent } from './users/users.component';
import { ChartsComponent } from './components/charts/charts.component';
import { UiComponent } from './components/ui/ui.component';
import { AuthTsComponent } from './lib/auth.ts/auth.ts.component';
import { DataTsComponent } from './lib/data.ts/data.ts.component';
import { FiltersTsComponent } from './lib/filters.ts/filters.ts.component';
import { InsightsTsComponent } from './lib/insights.ts/insights.ts.component';

@NgModule({
  declarations: [
    //AppComponent,
    // LoginComponent,
    //DashboardComponent,
    MapComponent,
    EventsComponent,
    UsersComponent,
    ChartsComponent,
    UiComponent,
    AuthTsComponent,
    DataTsComponent,
    FiltersTsComponent,
    InsightsTsComponent
  ],
  imports: [
    BrowserModule,
    AppComponent,
    LoginComponent,
    DashboardComponent,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
