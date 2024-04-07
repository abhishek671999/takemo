import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseManagementHomeComponent } from './expense-management-home.component';

describe('ExpenseManagementHomeComponent', () => {
  let component: ExpenseManagementHomeComponent;
  let fixture: ComponentFixture<ExpenseManagementHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExpenseManagementHomeComponent]
    });
    fixture = TestBed.createComponent(ExpenseManagementHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
