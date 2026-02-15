import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthTsComponent } from './auth.ts.component';

describe('AuthTsComponent', () => {
  let component: AuthTsComponent;
  let fixture: ComponentFixture<AuthTsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AuthTsComponent]
    });
    fixture = TestBed.createComponent(AuthTsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
