import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RulesService } from 'src/app/shared/services/roles/rules.service';

@Component({
  selector: 'app-delete-user-confirmation',
  templateUrl: './delete-user-confirmation.component.html',
  styleUrls: ['./delete-user-confirmation.component.css']
})
export class DeleteUserConfirmationComponent {

  constructor(
    private ruleService: RulesService,
    @Inject(MAT_DIALOG_DATA) public data,
    private matDialogRef: MatDialogRef<DeleteUserConfirmationComponent>
  ){}

  onDelete(){
    this.ruleService.deleteUserFromRule(this.data.bodyParams).subscribe(
      data => {
        console.log(data)
        this.matDialogRef.close({success: 'ok'})
      },
      error => {
        console.log(error)
        this.matDialogRef.close({success: 'failed'})
      }
    )
  }

  closeDialog(){
    this.matDialogRef.close()
  }
}
