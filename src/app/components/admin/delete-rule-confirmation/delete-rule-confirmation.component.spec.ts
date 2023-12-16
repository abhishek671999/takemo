import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteRuleConfirmationComponent } from './delete-rule-confirmation.component';

describe('DeleteRuleConfirmationComponent', () => {
  let component: DeleteRuleConfirmationComponent;
  let fixture: ComponentFixture<DeleteRuleConfirmationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteRuleConfirmationComponent]
    });
    fixture = TestBed.createComponent(DeleteRuleConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
