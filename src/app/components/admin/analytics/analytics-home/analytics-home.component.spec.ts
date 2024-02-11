import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsHomeComponent } from './analytics-home.component';

describe('AnalyticsHomeComponent', () => {
  let component: AnalyticsHomeComponent;
  let fixture: ComponentFixture<AnalyticsHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AnalyticsHomeComponent]
    });
    fixture = TestBed.createComponent(AnalyticsHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
