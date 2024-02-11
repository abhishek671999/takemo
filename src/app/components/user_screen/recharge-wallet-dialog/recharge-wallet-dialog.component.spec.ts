import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RechargeWalletDialogComponent } from './recharge-wallet-dialog.component';

describe('RechargeWalletDialogComponent', () => {
  let component: RechargeWalletDialogComponent;
  let fixture: ComponentFixture<RechargeWalletDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RechargeWalletDialogComponent]
    });
    fixture = TestBed.createComponent(RechargeWalletDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
