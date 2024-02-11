import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteCategoryConfirmationDialogComponent } from './delete-category-confirmation-dialog.component';

describe('DeleteCategoryConfirmationDialogComponent', () => {
  let component: DeleteCategoryConfirmationDialogComponent;
  let fixture: ComponentFixture<DeleteCategoryConfirmationDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteCategoryConfirmationDialogComponent]
    });
    fixture = TestBed.createComponent(DeleteCategoryConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
