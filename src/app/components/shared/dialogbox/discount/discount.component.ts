import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { addDiscountAmountValidation } from 'src/app/shared/validators/discount.validator';

@Component({
  selector: 'app-discount',
  templateUrl: './discount.component.html',
  styleUrls: ['./discount.component.css']
})
export class DiscountComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public formbuilder: FormBuilder,
    private matdialogRef: MatDialogRef<DiscountComponent>
  ){
console.log(data)
this.discountValue = data.discount_amount
  }
  public discountForm: FormGroup = this.formbuilder.group({
    discount: [this.data.discount_amount],
    total_amount: [this.data.total_amount + this.data.discount_amount]
  },{
    validators: [addDiscountAmountValidation()]
  });

  isPercentage = "no"
  discountValue = 0

  updateForm(){
    let value = this.discountValue
    if(this.isPercentage == "yes"){
      value = (this.discountValue/100) * this.data.total_amount
    }
    this.discountForm.patchValue({discount: value})
  }

  submit(){
    console.log(this.discountForm.value.discount)
    this.matdialogRef.close({discount: this.discountForm.value.discount})
  }

  close(){
    console.log(this.discountForm.value.discount)
    this.matdialogRef.close()
  }
}
