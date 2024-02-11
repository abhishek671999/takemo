import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryOrderDialogComponent } from './delivery-order-dialog.component';

describe('DeliveryOrderDialogComponent', () => {
  let component: DeliveryOrderDialogComponent;
  let fixture: ComponentFixture<DeliveryOrderDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeliveryOrderDialogComponent]
    });
    fixture = TestBed.createComponent(DeliveryOrderDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
