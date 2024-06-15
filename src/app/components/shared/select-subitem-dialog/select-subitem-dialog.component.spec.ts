import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectSubitemDialogComponent } from './select-subitem-dialog.component';

describe('SelectSubitemDialogComponent', () => {
  let component: SelectSubitemDialogComponent;
  let fixture: ComponentFixture<SelectSubitemDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SelectSubitemDialogComponent]
    });
    fixture = TestBed.createComponent(SelectSubitemDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
