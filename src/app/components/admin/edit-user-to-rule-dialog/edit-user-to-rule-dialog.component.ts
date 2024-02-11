import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RulesService } from 'src/app/shared/services/roles/rules.service';

@Component({
  selector: 'app-edit-user-to-rule-dialog',
  templateUrl: './edit-user-to-rule-dialog.component.html',
  styleUrls: ['./edit-user-to-rule-dialog.component.css']
})
export class EditUserToRuleDialogComponent {

  constructor(private _fb: FormBuilder,
    
    @Inject(MAT_DIALOG_DATA) public data){

  }


  userForm = this._fb.group({
    name: [ this.data.name, Validators.required],
    start_time: [this.data.start_time, Validators.required],
    end_time: [this.data.end_time, Validators.required],
    max_amount_per_shift: [this.data.max_amount_per_shift, Validators.required]
  });

}
