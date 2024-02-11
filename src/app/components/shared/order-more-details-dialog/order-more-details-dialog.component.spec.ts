import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderMoreDetailsDialogComponent } from './order-more-details-dialog.component';

describe('OrderMoreDetailsDialogComponent', () => {
  let component: OrderMoreDetailsDialogComponent;
  let fixture: ComponentFixture<OrderMoreDetailsDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrderMoreDetailsDialogComponent]
    });
    fixture = TestBed.createComponent(OrderMoreDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
