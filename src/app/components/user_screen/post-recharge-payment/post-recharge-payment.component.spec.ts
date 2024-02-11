import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostRechargePaymentComponent } from './post-recharge-payment.component';

describe('PostRechargePaymentComponent', () => {
  let component: PostRechargePaymentComponent;
  let fixture: ComponentFixture<PostRechargePaymentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PostRechargePaymentComponent]
    });
    fixture = TestBed.createComponent(PostRechargePaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
