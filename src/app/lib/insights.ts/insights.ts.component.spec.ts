import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsightsTsComponent } from './insights.ts.component';

describe('InsightsTsComponent', () => {
  let component: InsightsTsComponent;
  let fixture: ComponentFixture<InsightsTsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InsightsTsComponent]
    });
    fixture = TestBed.createComponent(InsightsTsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
