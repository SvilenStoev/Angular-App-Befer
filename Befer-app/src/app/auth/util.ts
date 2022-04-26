import { AbstractControl, FormGroup, ValidationErrors } from "@angular/forms";

export function whitespaceValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    if (/\s/g.test(value)) {
        return { whitespace: true };
    }

    return null;
}

export function emailValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    if (!/.{4,}@[\w]{2,}\.[a-z]{2,4}/.test(value)) {
        return { emailVal: true };
    }

    return null;
}

export function passMissmatchValidator(control: AbstractControl): ValidationErrors | null {
    const passGroup = control.parent as FormGroup;

    if (!passGroup) {
        return null;
    }

    const { password, repeatPass } = passGroup.controls;

    if (password.value !== repeatPass.value) {
        return { passMissmatch: true } 
    }

    return null;
} 

export function addOwner(record: any, userId: string) {
    if (userId) {
        record.owner = createPointer('_User', userId);
    }

    return record;
}

export function createPointer(className: string, objectId: string) {
    return {
        __type: 'Pointer',
        className,
        objectId
    }
}