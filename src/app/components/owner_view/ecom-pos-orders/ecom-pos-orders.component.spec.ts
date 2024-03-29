import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcomPosOrdersComponent } from './ecom-pos-orders.component';

describe('EcomPosOrdersComponent', () => {
  let component: EcomPosOrdersComponent;
  let fixture: ComponentFixture<EcomPosOrdersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EcomPosOrdersComponent]
    });
    fixture = TestBed.createComponent(EcomPosOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
