import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { PaymentsService } from 'src/app/shared/services/payments/payments.service';

@Component({
  selector: 'app-post-payment',
  templateUrl: './post-payment.component.html',
  styleUrls: ['./post-payment.component.css']
})
export class PostPaymentComponent {

  constructor(private _paymentService: PaymentsService, 
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,){
      iconRegistry.addSvgIconLiteral('success', sanitizer.bypassSecurityTrustHtml(this.svgTickMark));
      iconRegistry.addSvgIconLiteral('fail', sanitizer.bypassSecurityTrustHtml(this.svgFailMark))
    }

  transactionId = localStorage.getItem('transaction_id')
  transactionAmount = localStorage.getItem('total_amount')
  orderno = localStorage.getItem('order_no')
  

  success = false
  fail = false

  svgTickMark = `<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 40 40">
  <path fill="#bae0bd" d="M20,38.5C9.799,38.5,1.5,30.201,1.5,20S9.799,1.5,20,1.5S38.5,9.799,38.5,20S30.201,38.5,20,38.5z"></path><path fill="#5e9c76" d="M20,2c9.925,0,18,8.075,18,18s-8.075,18-18,18S2,29.925,2,20S10.075,2,20,2 M20,1 C9.507,1,1,9.507,1,20s8.507,19,19,19s19-8.507,19-19S30.493,1,20,1L20,1z"></path><path fill="none" stroke="#fff" stroke-miterlimit="10" stroke-width="2" d="M11 20L17 26 30 13"></path>
  </svg>`
  svgFailMark = `<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 40 40">
  <path fill="#f78f8f" d="M21 24.15L8.857 36.293 4.707 32.143 16.85 20 4.707 7.857 8.857 3.707 21 15.85 33.143 3.707 37.293 7.857 25.15 20 37.293 32.143 33.143 36.293z"></path><path fill="#c74343" d="M33.143,4.414l3.443,3.443L25.15,19.293L24.443,20l0.707,0.707l11.436,11.436l-3.443,3.443 L21.707,24.15L21,23.443l-0.707,0.707L8.857,35.586l-3.443-3.443L16.85,20.707L17.557,20l-0.707-0.707L5.414,7.857l3.443-3.443 L20.293,15.85L21,16.557l0.707-0.707L33.143,4.414 M33.143,3L21,15.143L8.857,3L4,7.857L16.143,20L4,32.143L8.857,37L21,24.857 L33.143,37L38,32.143L25.857,20L38,7.857L33.143,3L33.143,3z"></path>
  </svg>`

  
  
  ngOnInit(){
    this._paymentService.getTransactionStatus(this.transactionId).subscribe(
      data => {
        console.log('Response: ', data)
        if(data['success']){
          this.success = true
          this.fail = false

        }else{
          this.success = false
          this.fail = true
        }
        
      },
      error => {
        console.log("Something went wrong: ", error)
        this.fail = true
      }
    )
  }

}
