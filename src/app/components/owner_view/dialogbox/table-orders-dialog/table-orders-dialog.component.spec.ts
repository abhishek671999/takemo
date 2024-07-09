import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableOrdersDialogComponent } from './table-orders-dialog.component';

describe('TableOrdersDialogComponent', () => {
  let component: TableOrdersDialogComponent;
  let fixture: ComponentFixture<TableOrdersDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TableOrdersDialogComponent]
    });
    fixture = TestBed.createComponent(TableOrdersDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
