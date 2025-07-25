import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteUserConfirmationComponent } from './delete-user-confirmation.component';

describe('DeleteUserConfirmationComponent', () => {
  let component: DeleteUserConfirmationComponent;
  let fixture: ComponentFixture<DeleteUserConfirmationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteUserConfirmationComponent]
    });
    fixture = TestBed.createComponent(DeleteUserConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
