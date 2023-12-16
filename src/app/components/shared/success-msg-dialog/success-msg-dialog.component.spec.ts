import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessMsgDialogComponent } from './success-msg-dialog.component';

describe('SuccessMsgDialogComponent', () => {
  let component: SuccessMsgDialogComponent;
  let fixture: ComponentFixture<SuccessMsgDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SuccessMsgDialogComponent]
    });
    fixture = TestBed.createComponent(SuccessMsgDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
