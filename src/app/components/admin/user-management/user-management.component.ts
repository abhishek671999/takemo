import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { svgDeleteIcon, svgEditIcon, svgPlusIcon } from 'src/app/shared/icons/svg-icons';
import { RulesService } from 'src/app/shared/services/roles/rules.service';
import { AddRulesDialogComponent } from '../add-rules-dialog/add-rules-dialog.component';
import { EditRulesDialogComponent } from '../edit-rules-dialog/edit-rules-dialog.component';
import { SuccessMsgDialogComponent } from '../success-msg-dialog/success-msg-dialog.component';
import { ErrorMsgDialogComponent } from '../error-msg-dialog/error-msg-dialog.component';
import { DeleteConfirmationDialogComponent } from '../delete-confirmation-dialog/delete-confirmation-dialog.component';
// import { AddRulesDialogComponent } from '../add-rules-dialog/add-rules-dialog.component';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent {

  constructor(private _rulesService: RulesService, 
    public dialog: MatDialog,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    
    ){
      iconRegistry.addSvgIconLiteral('edit', sanitizer.bypassSecurityTrustHtml(svgEditIcon));
      iconRegistry.addSvgIconLiteral('delete', sanitizer.bypassSecurityTrustHtml(svgDeleteIcon));
      iconRegistry.addSvgIconLiteral('plus', sanitizer.bypassSecurityTrustHtml(svgPlusIcon));
  }

  showSpinner = true
  public rules;

  ngOnInit(){
    console.log('in ngoninit')
    this._rulesService.getRules().subscribe(
      data =>{
        console.log(data)
        this.rules = data
        this.showSpinner = false
      } ,
      error => (console.log(error))
    )
  }

  onSelect(rule){
    console.log(rule)
  }

  
  showSuccessDialog(msg: string){
    let dialogRef = this.dialog.open(SuccessMsgDialogComponent, {data: {msg: msg}})
          setTimeout(() => {
            dialogRef.close()
          }, 1500);
    this.ngOnInit()
  }

  showErrorDialog(msg: string){
    let dialogRef = this.dialog.open(ErrorMsgDialogComponent, {data: {msg: msg}})
    setTimeout(() => {
      dialogRef.close()
    }, 1500);
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

  editRule(rule){
    console.log('Edit rule: ', rule)
    let dialogRef = this.dialog.open(EditRulesDialogComponent, {data: rule})
    this.handlePostDialogClosure(dialogRef, 'Successfully edit the rule', 'Failed to edit rule. Please contact Takemo' )
  }

  deleteRule(rule){
    console.log('Delete Rule', rule)
    let dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {data: rule})
    this.handlePostDialogClosure(dialogRef, 'Successfully Delete the Rule', 'Failed to delete rule. Please contact Takemo')
    
  }


  addRule(){
    console.log('Add rule in user manangement')
    let dialogRef = this.dialog.open(AddRulesDialogComponent)
    this.handlePostDialogClosure(dialogRef, 'Successfully added the Rule', 'Failed to add rule. Please contact Takemo')
  }
}
