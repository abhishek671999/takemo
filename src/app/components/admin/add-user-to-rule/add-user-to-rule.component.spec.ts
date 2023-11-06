import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUserToRuleComponent } from './add-user-to-rule.component';

describe('AddUserToRuleComponent', () => {
  let component: AddUserToRuleComponent;
  let fixture: ComponentFixture<AddUserToRuleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddUserToRuleComponent]
    });
    fixture = TestBed.createComponent(AddUserToRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
