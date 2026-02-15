import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltersTsComponent } from './filters.ts.component';

describe('FiltersTsComponent', () => {
  let component: FiltersTsComponent;
  let fixture: ComponentFixture<FiltersTsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FiltersTsComponent]
    });
    fixture = TestBed.createComponent(FiltersTsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
