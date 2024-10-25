import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddItemNoteDialogComponent } from './add-item-note-dialog.component';

describe('AddItemNoteDialogComponent', () => {
  let component: AddItemNoteDialogComponent;
  let fixture: ComponentFixture<AddItemNoteDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddItemNoteDialogComponent]
    });
    fixture = TestBed.createComponent(AddItemNoteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
