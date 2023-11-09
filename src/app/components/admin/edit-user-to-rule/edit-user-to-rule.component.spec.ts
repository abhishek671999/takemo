import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditUserToRuleComponent } from './edit-user-to-rule.component';

describe('EditUserToRuleComponent', () => {
  let component: EditUserToRuleComponent;
  let fixture: ComponentFixture<EditUserToRuleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditUserToRuleComponent]
    });
    fixture = TestBed.createComponent(EditUserToRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
