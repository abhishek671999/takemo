import { AbstractControl, ValidatorFn, ValidationErrors, AsyncValidatorFn} from "@angular/forms";
import { SignupService } from "../signup.service";
import { Observable, map } from "rxjs";
import { __values } from "tslib";

// export function emailValidator(signupService: SignupService): ValidatorFn{
//     return (control: AbstractControl): {[key: string]: any} | null => {
//         const email_or_phone = control.value
//         let data;
//         signupService.isUserRegistered(email_or_phone).subscribe(
//             response_data => data = response_data,
//             error => console.error(error)           
//         )
//         console.log('DAta received after validating: ', data)
//         return data=='true'? {result: true} : null
        
//     }
// };

export function userNameValidator(signupService: SignupService): AsyncValidatorFn {
    return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
        return signupService.isUserRegistered(control.value).pipe(map(
            response_data => {
                console.log('Response from backend', response_data['user_registered'])
                return response_data['user_registered']==true ? { "userExists": true } : null;
            }

        ))      
        
    }
  }
