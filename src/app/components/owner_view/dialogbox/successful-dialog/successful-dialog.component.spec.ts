import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessfulDialogComponent } from './successful-dialog.component';

describe('SuccessfulDialogComponent', () => {
  let component: SuccessfulDialogComponent;
  let fixture: ComponentFixture<SuccessfulDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SuccessfulDialogComponent]
    });
    fixture = TestBed.createComponent(SuccessfulDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
