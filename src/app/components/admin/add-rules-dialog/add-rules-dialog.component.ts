import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { RulesService } from 'src/app/shared/services/roles/rules.service';

@Component({
  selector: 'app-add-rules-dialog',
  templateUrl: './add-rules-dialog.component.html',
  styleUrls: ['./add-rules-dialog.component.css']
})
export class AddRulesDialogComponent {
  constructor(private _formBuilder: FormBuilder,
    private _rulesService: RulesService,
    private dialogRef: MatDialogRef<AddRulesDialogComponent>){}
  
  addRuleForm = this._formBuilder.group({
    name: ['', Validators.required],
    start_time: ['', Validators.required],
    end_time: ['', Validators.required],
    max_amount_per_shift: ['', [Validators.required]],
    checked: new FormControl(true, Validators.required)
  });

  
  getTwentyFourHourTime(amPmString) { 
    var d = new Date("1/1/2013 " + amPmString); 
    return d.getHours() + ':' + d.getMinutes(); 
}


  addRule(){
    let body = {
        "name": this.addRuleForm.value.name,
        "start_time":this.getTwentyFourHourTime(this.addRuleForm.value.start_time),
        "end_time": this.getTwentyFourHourTime(this.addRuleForm.value.end_time),
        "max_amount_per_shift": this.addRuleForm.value.max_amount_per_shift,
        "same_day_end_date": this.addRuleForm.value.checked
    }
    this._rulesService.addRule(body).subscribe(
      data => {
        this.dialogRef.close({success: 'ok'})
      },
      error => {
       this.dialogRef.close({success: 'failed', msg: error.error.error})
      }
    )
  }

  closeDialog(){
    this.dialogRef.close()
  }
}
