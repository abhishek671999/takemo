import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditUserToRuleDialogComponent } from './edit-user-to-rule-dialog.component';

describe('EditUserToRuleDialogComponent', () => {
  let component: EditUserToRuleDialogComponent;
  let fixture: ComponentFixture<EditUserToRuleDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditUserToRuleDialogComponent]
    });
    fixture = TestBed.createComponent(EditUserToRuleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
