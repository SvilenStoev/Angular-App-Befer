import { AbstractControl, ControlContainer, ValidationErrors, ValidatorFn } from "@angular/forms";


export function whitespaceValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    if (/\s/g.test(value)) {
        return { whitespace: true };
    }

    return null;
}

export function emailValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    if (/.{4,}@[\w]{2,}\.[a-z]{2,4}/.test(value)) {
        return { emailError: true };
    }

    return null;
}