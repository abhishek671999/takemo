import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodCounterManagementComponent } from './food-counter-management.component';

describe('FoodCounterManagementComponent', () => {
  let component: FoodCounterManagementComponent;
  let fixture: ComponentFixture<FoodCounterManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FoodCounterManagementComponent]
    });
    fixture = TestBed.createComponent(FoodCounterManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
