import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRulesDialogComponent } from './edit-rules-dialog.component';

describe('EditRulesDialogComponent', () => {
  let component: EditRulesDialogComponent;
  let fixture: ComponentFixture<EditRulesDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditRulesDialogComponent]
    });
    fixture = TestBed.createComponent(EditRulesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
