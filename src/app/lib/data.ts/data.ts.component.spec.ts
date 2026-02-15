import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataTsComponent } from './data.ts.component';

describe('DataTsComponent', () => {
  let component: DataTsComponent;
  let fixture: ComponentFixture<DataTsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DataTsComponent]
    });
    fixture = TestBed.createComponent(DataTsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
