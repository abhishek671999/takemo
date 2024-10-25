import { Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-item-note-dialog',
  templateUrl: './add-item-note-dialog.component.html',
  styleUrls: ['./add-item-note-dialog.component.css']
})
export class AddItemNoteDialogComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private matdialogRef: MatDialogRef<AddItemNoteDialogComponent>
  ){
    this.note = data.note
  }

  public note: string;

  addNote(){
    this.data.note = this.note
    this.matdialogRef.close()
  }

  close(){
    this.matdialogRef.close()
  }
}
