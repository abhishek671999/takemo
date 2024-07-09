import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableCockpitComponent } from './table-cockpit.component';

describe('TableCockpitComponent', () => {
  let component: TableCockpitComponent;
  let fixture: ComponentFixture<TableCockpitComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TableCockpitComponent]
    });
    fixture = TestBed.createComponent(TableCockpitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
