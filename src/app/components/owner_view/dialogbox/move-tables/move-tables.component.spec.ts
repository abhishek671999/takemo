import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveTablesComponent } from './move-tables.component';

describe('MoveTablesComponent', () => {
  let component: MoveTablesComponent;
  let fixture: ComponentFixture<MoveTablesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MoveTablesComponent]
    });
    fixture = TestBed.createComponent(MoveTablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
