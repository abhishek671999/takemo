import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcelDialogComponent } from './parcel-dialog.component';

describe('ParcelDialogComponent', () => {
  let component: ParcelDialogComponent;
  let fixture: ComponentFixture<ParcelDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ParcelDialogComponent]
    });
    fixture = TestBed.createComponent(ParcelDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
