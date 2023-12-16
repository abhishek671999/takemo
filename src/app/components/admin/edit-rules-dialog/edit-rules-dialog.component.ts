import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormControlDirective, Validators } from '@angular/forms';
import {  MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RulesService } from 'src/app/shared/services/roles/rules.service';
import { AddUserToRuleComponent } from '../add-user-to-rule/add-user-to-rule.component';
import {Chart} from 'chart.js';
import { EditUserToRuleDialogComponent } from '../edit-user-to-rule-dialog/edit-user-to-rule-dialog.component';
import { DeleteConfirmationDialogComponent } from '../delete-confirmation-dialog/delete-confirmation-dialog.component';
import { SuccessMsgDialogComponent } from '../../shared/success-msg-dialog/success-msg-dialog.component';
import { ErrorMsgDialogComponent } from '../../shared/error-msg-dialog/error-msg-dialog.component';
import { DeleteUserConfirmationComponent } from '../delete-user-confirmation/delete-user-confirmation.component';

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
  ){
    console.log('This is data received in edit rules: ', data['same_day_end_time'])
  }
  public checked = new FormControl(this.data['same_day_end_time'])
  public users;

  ngOnInit(){
    let params = {'rule_id': this.data.id}
    this._ruleService.getRuleUsers(params).subscribe(
      data => {
        console.log('This is user data: ', data)
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
      "max_amount_per_shift": this.editRulesForm.value.max_amount_per_shift,
      "same_day_end_date": this.checked.value
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
    let dialogRef = this.matDialog.open(AddUserToRuleComponent, {data: {'rule_id': this.data.id}})
    this.handlePostDialogClosure(dialogRef, 'Successfully added user to shift', 'Failed to Add user to shift')
  }

  editUser(user){
    console.log('Editing this user: ', user)
    this.matDialog.open(EditUserToRuleDialogComponent, {data: user})
  }


  deleteUser(user){
    console.log('Deleting this user: ', user)
    let params = {"rule_id": this.data.id, "restaurant_id": user.restaurant_id, "user_id": user.user_id}
    let additionalData = { userEmail: user.user_email}
    let dialogData = {bodyParams: params, additionalData: additionalData}
    let dialogRef = this.matDialog.open(DeleteUserConfirmationComponent, {data: dialogData})
    this.handlePostDialogClosure(
      dialogRef, 'Successfully Deleted User from Shift',
      'Failed to Delete user from Shift')
  }

  onCancelClick(){
    this.dialogRef.close()
  }


  handlePostDialogClosure(dialogRef, successMsg, errorMsg){
    dialogRef.afterClosed().subscribe(
      data => {
        console.log('Edit rule close with: ', data)
        if(data == undefined){
          console.log('Nothing')
        }else if(data.success == 'ok'){
          this.showSuccessDialog(successMsg)
        }else if(data.success == 'failed'){
          this.showErrorDialog(errorMsg)
        }
      },
      error => {
        console.log('Error while clsoing edit rule: ', error)
        this.showErrorDialog(errorMsg)
      }
    )
  }

  showSuccessDialog(msg: string){
    let dialogRef = this.matDialog.open(SuccessMsgDialogComponent, {data: {msg: msg}})
          setTimeout(() => {
            dialogRef.close()
          }, 1500);
    this.ngOnInit()
  }

  showErrorDialog(msg: string){
    let dialogRef = this.matDialog.open(ErrorMsgDialogComponent, {data: {msg: msg}})
    setTimeout(() => {
      dialogRef.close()
    }, 1500);
  }
  
}
