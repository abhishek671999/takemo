import { HttpParams } from '@angular/common/http';
import { Component, Inject, inject } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CounterService } from 'src/app/shared/services/inventory/counter.service';

@Component({
  selector: 'app-add-item-note-dialog',
  templateUrl: './add-item-note-dialog.component.html',
  styleUrls: ['./add-item-note-dialog.component.css']
})
export class AddItemNoteDialogComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private counterService: CounterService,
    private matdialogRef: MatDialogRef<AddItemNoteDialogComponent>
  ){
    console.log(data, this.hold, this.prepare)
    data.note = data.note || ''
    this.note = data.note
    this.quantity = this.data.quantity
  }

  public note: string;
  public hold: boolean;
  public prepare: boolean;
  public quantity: number
  public inventoryNotes: [] = []

  ngOnInit(){
    let httpParams = new HttpParams()
    httpParams = httpParams.append('item_id', this.data.item_id)
    this.counterService.getItemSpecialNotes(httpParams).subscribe(
      (data) => {
        this.inventoryNotes = data['predefined_special_note_list']
      },
      (error) => {
        console.log(error.error.description)
      }
    )
  }

  addNote(){
    console.log(this.hold, this.prepare)
    let addiitonalNote =  this.hold ? `${this.quantity} hold` : this.prepare? `${this.quantity} running`: ''
    this.data.note = (this.data.note? this.data.note   : '' ) + ((this.data.note && addiitonalNote)? ` | ${addiitonalNote}`: `${addiitonalNote}`)
    console.log(this.data.note)
    this.matdialogRef.close()
  }

  updateNote(note, event: MatCheckboxChange){
    let noteString = ` ${note} |`
    if(event.checked){
      this.data.note += noteString
    }else{
      this.data.note = this.data.note.replace(noteString, '')
    }
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
