import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagmentHomeComponent } from './managment-home.component';

describe('ManagmentHomeComponent', () => {
  let component: ManagmentHomeComponent;
  let fixture: ComponentFixture<ManagmentHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManagmentHomeComponent]
    });
    fixture = TestBed.createComponent(ManagmentHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
