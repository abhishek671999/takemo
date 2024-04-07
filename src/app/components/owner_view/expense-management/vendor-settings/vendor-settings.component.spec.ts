import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorSettingsComponent } from './vendor-settings.component';

describe('VendorSettingsComponent', () => {
  let component: VendorSettingsComponent;
  let fixture: ComponentFixture<VendorSettingsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VendorSettingsComponent]
    });
    fixture = TestBed.createComponent(VendorSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
