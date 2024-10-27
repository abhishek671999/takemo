import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputPasswordDialogComponent } from './input-password-dialog.component';

describe('InputPasswordDialogComponent', () => {
  let component: InputPasswordDialogComponent;
  let fixture: ComponentFixture<InputPasswordDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InputPasswordDialogComponent]
    });
    fixture = TestBed.createComponent(InputPasswordDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
