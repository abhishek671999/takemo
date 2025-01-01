import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function addDiscountAmountValidation(): ValidatorFn {
    return (form: AbstractControl): ValidationErrors | null => {
  
        const discountAmount = form.get("discount")?.value;
        const totalAmount = form.get('total_amount')?.value
        console.log('In val func', discountAmount, totalAmount)
        if (discountAmount && totalAmount) {
          if(typeof(discountAmount)==='number' && discountAmount < 0){
            return  {lessThanZero:true}
          }
          return discountAmount <= totalAmount ? null : {incorrectDiscountAmount:true};
        }
  
        return null;
    }
  }
  