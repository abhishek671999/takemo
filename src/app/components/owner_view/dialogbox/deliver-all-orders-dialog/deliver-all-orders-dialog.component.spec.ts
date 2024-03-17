import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliverAllOrdersDialogComponent } from './deliver-all-orders-dialog.component';

describe('DeliverAllOrdersDialogComponent', () => {
  let component: DeliverAllOrdersDialogComponent;
  let fixture: ComponentFixture<DeliverAllOrdersDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeliverAllOrdersDialogComponent]
    });
    fixture = TestBed.createComponent(DeliverAllOrdersDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
