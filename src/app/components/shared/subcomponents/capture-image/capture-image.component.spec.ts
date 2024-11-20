import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaptureImageComponent } from './capture-image.component';

describe('CaptureImageComponent', () => {
  let component: CaptureImageComponent;
  let fixture: ComponentFixture<CaptureImageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CaptureImageComponent]
    });
    fixture = TestBed.createComponent(CaptureImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
