import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA,  MatDialogRef } from '@angular/material/dialog';
import { RulesService } from 'src/app/shared/services/roles/rules.service';

@Component({
  selector: 'app-delete-confirmation-dialog',
  templateUrl: './delete-confirmation-dialog.component.html',
  styleUrls: ['./delete-confirmation-dialog.component.css']
})
export class DeleteConfirmationDialogComponent {

  constructor(
    private _rulesService: RulesService,
    @Inject(MAT_DIALOG_DATA) public data,
    private matDialogRef: MatDialogRef<DeleteConfirmationDialogComponent>
  ){}

  ngOnInit(){
    console.log('Data recieved: ', this.data)
  }

  onDelete(){
    let body = {
      "id": this.data.id
    }
    this._rulesService.deleteRule(body).subscribe(
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
