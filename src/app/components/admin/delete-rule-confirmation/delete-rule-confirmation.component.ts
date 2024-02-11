import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RulesService } from 'src/app/shared/services/roles/rules.service';

@Component({
  selector: 'app-delete-rule-confirmation',
  templateUrl: './delete-rule-confirmation.component.html',
  styleUrls: ['./delete-rule-confirmation.component.css']
})
export class DeleteRuleConfirmationComponent {
  constructor(
    private ruleService: RulesService,
    @Inject(MAT_DIALOG_DATA) public data,
    private matDialogRef: MatDialogRef<DeleteRuleConfirmationComponent>
  ){console.log('Data received for deleting: ', this.data)
}
public numberOfUsers;

ngOnInit(){
  let params = {
    'rule_id': this.data.bodyParams.rule_id
  }
  this.ruleService.getRuleUsers(params).subscribe(
    data => this.numberOfUsers = data['users'].length,
    error => this.numberOfUsers = 'NA'
  )
}


  onDelete(){
    
    this.ruleService.deleteRule(this.data.bodyParams).subscribe(
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
