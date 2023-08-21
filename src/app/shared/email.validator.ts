import { AbstractControl } from "@angular/forms";



export function emailValidator(control: AbstractControl): {[key: string]: any} | null{
    const expression: RegExp = /^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$/;
    const email = expression.test(control.value);
    return email ? {'invalid_email': true} : null;
}