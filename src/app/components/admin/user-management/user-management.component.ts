import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { svgDeleteIcon, svgEditIcon, svgPlusIcon } from 'src/app/shared/icons/svg-icons';
import { RulesService } from 'src/app/shared/services/roles/rules.service';
import { AddRulesDialogComponent } from '../add-rules-dialog/add-rules-dialog.component';
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
    iconRegistry.addSvgIconLiteral(
      'edit',
      sanitizer.bypassSecurityTrustHtml(svgEditIcon)
    );
    iconRegistry.addSvgIconLiteral(
      'delete',
      sanitizer.bypassSecurityTrustHtml(svgDeleteIcon)
    );
    iconRegistry.addSvgIconLiteral(
      'plus',
      sanitizer.bypassSecurityTrustHtml(svgPlusIcon)
    );
  }

  showSpinner = true
  public rules
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

  deleteRule(rule){
    console.log('Delete Rule', rule)
    let body = {
      "id": rule.id
    }
    this._rulesService.deleteRule(body).subscribe(
      data => {
        console.log(data)
      },
      error => {
        console.log(error)
      }
    )
  }

  editRule(rule){
    console.log('Edit rule: ', rule)
  }

  addRule(){
    console.log('Add rule in user manangement')
    let dialogRef = this.dialog.open(AddRulesDialogComponent)
       
  }
}
