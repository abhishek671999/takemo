import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DummyUploadImagesComponent } from './dummy-upload-images.component';

describe('DummyUploadImagesComponent', () => {
  let component: DummyUploadImagesComponent;
  let fixture: ComponentFixture<DummyUploadImagesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DummyUploadImagesComponent]
    });
    fixture = TestBed.createComponent(DummyUploadImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
