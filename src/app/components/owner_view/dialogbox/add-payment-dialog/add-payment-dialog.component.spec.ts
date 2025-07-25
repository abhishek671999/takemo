import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPaymentDialogComponent } from './add-payment-dialog.component';

describe('AddPaymentDialogComponent', () => {
  let component: AddPaymentDialogComponent;
  let fixture: ComponentFixture<AddPaymentDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddPaymentDialogComponent]
    });
    fixture = TestBed.createComponent(AddPaymentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
