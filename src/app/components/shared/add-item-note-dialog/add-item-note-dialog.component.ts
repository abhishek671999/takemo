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
    console.log(data, this.hold, this.prepare)
    this.note = data.note
    this.quantity = this.data.quantity
  }

  public note: string;
  public hold: boolean;
  public prepare: boolean;
  public quantity: number

  addNote(){
    console.log(this.hold, this.prepare)
    let addiitonalNote =  this.hold ? `${this.quantity} hold` : this.prepare? `${this.quantity} running`: ''
    this.data.note = (this.note? this.note : '' ) + ((this.note && addiitonalNote)? ` | ${addiitonalNote}`: `${addiitonalNote}`)
    console.log(this.data.note)
    this.matdialogRef.close()
  }

  close(){
    this.matdialogRef.close()
  }

  addItem(){
    if(this.quantity < this.data.quantity ) this.quantity += 1
  }

  subItem(){
    if(this.quantity > 0 ) this.quantity -= 1
  }
}
