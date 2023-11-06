import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {  MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RulesService } from 'src/app/shared/services/roles/rules.service';
import { AddUserToRuleComponent } from '../add-user-to-rule/add-user-to-rule.component';

@Component({
  selector: 'app-edit-rules-dialog',
  templateUrl: './edit-rules-dialog.component.html',
  styleUrls: ['./edit-rules-dialog.component.css']
})
export class EditRulesDialogComponent {
  
  constructor(private _fb: FormBuilder,
    private _ruleService: RulesService,
    private matDialog: MatDialog,
    //@Inject(MAT_DIALOG_DATA) public data,
     //private dialogRef: MatDialogRef<EditRulesDialogComponent>
     ){}

  public users;
  ngOnInit(){
    let params = {'rule_id': 2}
    this._ruleService.getRuleUsers(params).subscribe(
      data => this.users = data,
      error => console.log(error) 
    )
  }

  editRulesForm = this._fb.group({
    name: ['', Validators.required],
    start_time: ['', Validators.required],
    end_time: ['', Validators.required],
    max_amount_per_shift: ['', Validators.required]
  });

  editRule(){
    console.log(this.editRulesForm.value)
  }

  addUser(){
    console.log('Adding user')
    this.matDialog.open(AddUserToRuleComponent)
  }

  editUser(user){
    console.log('Editing this user: ', user)
  }

  deleteUser(user){
    console.log('Deleting this user: ', user)
  }

}
