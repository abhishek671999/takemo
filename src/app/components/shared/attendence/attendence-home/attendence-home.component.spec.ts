import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendenceHomeComponent } from './attendence-home.component';

describe('AttendenceHomeComponent', () => {
  let component: AttendenceHomeComponent;
  let fixture: ComponentFixture<AttendenceHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AttendenceHomeComponent]
    });
    fixture = TestBed.createComponent(AttendenceHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
