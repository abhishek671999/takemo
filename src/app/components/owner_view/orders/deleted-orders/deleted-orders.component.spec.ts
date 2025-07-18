import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletedOrdersComponent } from './deleted-orders.component';

describe('DeletedOrdersComponent', () => {
  let component: DeletedOrdersComponent;
  let fixture: ComponentFixture<DeletedOrdersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeletedOrdersComponent]
    });
    fixture = TestBed.createComponent(DeletedOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
