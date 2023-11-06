import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRulesDialogComponent } from './add-rules-dialog.component';

describe('AddRulesDialogComponent', () => {
  let component: AddRulesDialogComponent;
  let fixture: ComponentFixture<AddRulesDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddRulesDialogComponent]
    });
    fixture = TestBed.createComponent(AddRulesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
