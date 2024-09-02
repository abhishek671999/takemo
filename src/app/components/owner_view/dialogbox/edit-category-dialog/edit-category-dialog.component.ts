import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmActionDialogComponent } from 'src/app/components/shared/confirm-action-dialog/confirm-action-dialog.component';
import { ErrorMsgDialogComponent } from 'src/app/components/shared/error-msg-dialog/error-msg-dialog.component';
import { SuccessMsgDialogComponent } from 'src/app/components/shared/success-msg-dialog/success-msg-dialog.component';
import { ConfirmationDialogComponent } from 'src/app/components/user_screen/confirmation-dialog/confirmation-dialog.component';
import { EditMenuService } from 'src/app/shared/services/menu/edit-menu.service';

@Component({
  selector: 'app-edit-category-dialog',
  templateUrl: './edit-category-dialog.component.html',
  styleUrls: ['./edit-category-dialog.component.css']
})
export class EditCategoryDialogComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formbuilder: FormBuilder,
    private matdialog: MatDialog,
    private editMenuService: EditMenuService,
    private matdialogRef: MatDialogRef<EditCategoryDialogComponent>
  ){
    console.log(data)
    this.editCategoryForm = this.formbuilder.group({
      category_id: [data.categoryId ],
      category_name: [data.categoryName, [Validators.required]]
    })
  }

  public editCategoryForm: FormGroup

  toggleCategory(){
    let body = {
      category_id: this.data.categoryId,
      hide_cateogry: !this.data.hide_category
    }
    this.editMenuService.editCategoryAvailability(body).subscribe(
      (data: any) => {
        this.matdialog.open(SuccessMsgDialogComponent, {data: {msg: 'Successfully availability updated'}})
      },
      (error: any) => {
        this.matdialog.open(ErrorMsgDialogComponent, {data: {msg: 'Failed to update availabilty'}})
      }
    )
  }

  editCategory(){
    let body = {
      category_id: this.editCategoryForm.value.category_id,
      name: this.editCategoryForm.value.category_name
    }
    this.editMenuService.editCategory(body).subscribe(
      (data: any) => {
        this.matdialog.open(SuccessMsgDialogComponent, {data: {msg: 'Category updated successfully'}})
        this.matdialogRef.close({result: true})
      },
      (error: any) => {
        this.matdialog.open(ErrorMsgDialogComponent, { data: {msg: 'Failed to update category'}})
      }
    )
  }

  deleteCategory(){
    let matdialog = this.matdialog.open(ConfirmActionDialogComponent, {data: 'Are you sure want to delete this category?'})
    matdialog.afterClosed().subscribe(
      (data: any) => {
        if(data?.select){
          let body = {
            category_id: this.editCategoryForm.value.category_id
          }
          this.editMenuService.deleteCategory(body).subscribe(
            (data: any) => {
              this.matdialog.open(SuccessMsgDialogComponent, {data: {msg: "Category delete successfully"}})
              this.matdialogRef.close({result: true})
            },
            (error: any) => {
              this.matdialog.open(ErrorMsgDialogComponent, {data: {msg: "Failed to delete category"}})
            }
          )
        }
      }
    )
  }


}
