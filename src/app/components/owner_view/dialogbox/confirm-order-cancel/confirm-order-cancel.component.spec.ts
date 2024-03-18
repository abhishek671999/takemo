import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmOrderCancelComponent } from './confirm-order-cancel.component';

describe('ConfirmOrderCancelComponent', () => {
  let component: ConfirmOrderCancelComponent;
  let fixture: ComponentFixture<ConfirmOrderCancelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmOrderCancelComponent]
    });
    fixture = TestBed.createComponent(ConfirmOrderCancelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
