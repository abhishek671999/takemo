import { AbstractControl } from "@angular/forms";

export function passwordValidator(control: AbstractControl): {[key: string]: any} | null {
    const password = control.get('pwd');
    const confirmPassword = control.get('rpwd');
    return password && confirmPassword && password.value != confirmPassword.value ? {'mismatch': true}: null;
}