import {
  AbstractControl,
  ValidatorFn,
  ValidationErrors,
  AsyncValidatorFn,
  FormGroup,
} from '@angular/forms';
import { SignupService } from '../services/register/signup.service';
import { Observable, map } from 'rxjs';
import { __values } from 'tslib';


export function userNameValidator(
  signupService: SignupService
): AsyncValidatorFn {
  return (
    control: AbstractControl
  ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
    return signupService.isUserRegistered(control.value).pipe(
      map((response_data) => {
        console.log('Response from backend', response_data['user_registered']);
        return response_data['user_registered'] == true
          ? { userExists: true }
          : null;
      })
    );
  };
}

export const atLeastOne = (validator: ValidatorFn, controls: string[] = null) => (group: FormGroup): ValidationErrors | null => {
  if (!controls) {
    controls = Object.keys(group.controls)
  }
  const hasAtLeaseOne = group && group.controls && controls
    .some(k => !validator(group.controls[k]))
  
  return hasAtLeaseOne ? null : {
    atLeastOne: true
  }
}