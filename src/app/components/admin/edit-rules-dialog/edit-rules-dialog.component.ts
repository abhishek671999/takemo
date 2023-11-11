import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {  MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RulesService } from 'src/app/shared/services/roles/rules.service';
import { AddUserToRuleComponent } from '../add-user-to-rule/add-user-to-rule.component';
import {Chart} from 'chart.js';
import { EditUserToRuleDialogComponent } from '../edit-user-to-rule-dialog/edit-user-to-rule-dialog.component';

@Component({
  selector: 'app-edit-rules-dialog',
  templateUrl: './edit-rules-dialog.component.html',
  styleUrls: ['./edit-rules-dialog.component.css']
})
export class EditRulesDialogComponent {
  public chart: any;
  constructor(private _fb: FormBuilder,
    private _ruleService: RulesService,
    private matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data,
    private dialogRef: MatDialogRef<EditRulesDialogComponent>
  ){}

  public users;

  ngOnInit(){
    let params = {'rule_id': this.data.id}
    this._ruleService.getRuleUsers(params).subscribe(
      data => {
        this.users = data
        this.users.forEach(element => {
          element.is_deleted = false
        });
      },
      error => console.log(error) 
    )
  }

  editRulesForm = this._fb.group({
    name: [ this.data.name, Validators.required],
    start_time: [this.data.start_time, Validators.required],
    end_time: [this.data.end_time, Validators.required],
    max_amount_per_shift: [this.data.max_amount_per_shift, Validators.required]
  });

  editRule(){
    console.log(this.editRulesForm.value)
    let body = {
      "id": this.data.id,
      "name": this.editRulesForm.value.name,
      "start_time": this.editRulesForm.value.start_time,
      "end_time": this.editRulesForm.value.end_time,
      "max_amount_per_shift": this.editRulesForm.value.max_amount_per_shift
    }
    this._ruleService.editRule(body).subscribe(
      data =>{
        console.log(data)
        setTimeout(() => {
          this.dialogRef.close({success: 'ok'})
        }, 1000);
      },
      error => {
        console.log(error)
        alert('Error')
      }
    )
  }

  addUser(){
    console.log('Adding user')
    this.matDialog.open(AddUserToRuleComponent, {data: {'rule_id': this.data.id}})
  }

  editUser(user){
    console.log('Editing this user: ', user)
    this.matDialog.open(EditUserToRuleDialogComponent, {data: user})
  }

  deleteUser(user){
    console.log('Deleting this user: ', user)
    let body ={
      "rule_id": this.data.id,
      "restaurant_id": 1,
      "user_id": user.id
    }
    this._ruleService.deleteUserFromRule(body).subscribe(
      data => {
        console.log(data)
        user.is_deleted = true
      },
      error => {
        console.log(error)
        alert('Error while deleting')
      }
    )
  }

  onCancelClick(){
    this.dialogRef.close()
  }

  
}
