import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllRestaurantsCombinedComponent } from './all-restaurants-combined.component';

describe('AllRestaurantsCombinedComponent', () => {
  let component: AllRestaurantsCombinedComponent;
  let fixture: ComponentFixture<AllRestaurantsCombinedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllRestaurantsCombinedComponent]
    });
    fixture = TestBed.createComponent(AllRestaurantsCombinedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
