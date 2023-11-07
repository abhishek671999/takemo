import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelyAnalyticsComponent } from './timely-analytics.component';

describe('TimelyAnalyticsComponent', () => {
  let component: TimelyAnalyticsComponent;
  let fixture: ComponentFixture<TimelyAnalyticsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TimelyAnalyticsComponent]
    });
    fixture = TestBed.createComponent(TimelyAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
