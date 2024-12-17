import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrepareLaterDialogComponent } from './prepare-later-dialog.component';

describe('PrepareLaterDialogComponent', () => {
  let component: PrepareLaterDialogComponent;
  let fixture: ComponentFixture<PrepareLaterDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrepareLaterDialogComponent]
    });
    fixture = TestBed.createComponent(PrepareLaterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
