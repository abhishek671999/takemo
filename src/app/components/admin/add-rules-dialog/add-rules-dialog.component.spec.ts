import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRulesDialogComponent } from './add-rules-dialog.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RulesService } from 'src/app/shared/services/roles/rules.service';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

fdescribe('AddRulesDialogComponent', () => {
  let component: AddRulesDialogComponent;
  let fixture: ComponentFixture<AddRulesDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddRulesDialogComponent],
      imports: [HttpClientModule, MatDialogModule,MatFormFieldModule, MatInputModule, NgxMatTimepickerModule,
         MatCheckboxModule, ReactiveFormsModule, BrowserAnimationsModule],
      providers: [FormBuilder, RulesService,
      {
        provide: MatDialogRef,
        useValue: {
          close: jasmine.createSpy('close')
        }
      },
      {
        provide: MAT_DIALOG_DATA,
        useValue: {}
      }]
    });
    fixture = TestBed.createComponent(AddRulesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    let format = component.getTwentyFourHourTime('12:00 AM')
    expect(format).toEqual('0:0');
  });
  it('should create', () => {
    let format = component.getTwentyFourHourTime('12:00 PM')
    expect(format).toEqual('12:0');
  });
});
