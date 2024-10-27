import { Component, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-input-password-dialog',
  templateUrl: './input-password-dialog.component.html',
  styleUrls: ['./input-password-dialog.component.css']
})
export class InputPasswordDialogComponent {
  constructor(
    private matdialogRef: MatDialogRef<InputPasswordDialogComponent>
  ){

  }
  public password: string;

  close(){
    this.matdialogRef.close()
  }

  submit(){
    this.matdialogRef.close({password: this.password})
  }
}
