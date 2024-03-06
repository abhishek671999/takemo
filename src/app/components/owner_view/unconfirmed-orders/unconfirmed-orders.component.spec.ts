import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnconfirmedOrdersComponent } from './unconfirmed-orders.component';

describe('UnconfirmedOrdersComponent', () => {
  let component: UnconfirmedOrdersComponent;
  let fixture: ComponentFixture<UnconfirmedOrdersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UnconfirmedOrdersComponent]
    });
    fixture = TestBed.createComponent(UnconfirmedOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
