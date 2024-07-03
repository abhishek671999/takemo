import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendEmailReportDialogComponent } from './send-email-report-dialog.component';

describe('SendEmailReportDialogComponent', () => {
  let component: SendEmailReportDialogComponent;
  let fixture: ComponentFixture<SendEmailReportDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SendEmailReportDialogComponent]
    });
    fixture = TestBed.createComponent(SendEmailReportDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
