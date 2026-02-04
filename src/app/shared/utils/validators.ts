import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

const EMAIL_REGEX = new RegExp('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$', 'i');

// Validador personalizado para el patrón de correo electrónico estricto.

export function emailPatternValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) {
      return null;
    }
    return EMAIL_REGEX.test(value) ? null : { invalidEmailPattern: true };
  };
}


// Validador personalizado para contraseñas iguales

export function matchPasswordValidator(controlName: string, matchingControlName: string): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {

    const form = formGroup as FormGroup;
    const control = form.get(controlName);
    const matchingControl = form.get(matchingControlName);

    if (!control || !matchingControl) {
      return null;
    }

    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ 'passwordMismatch': true });
      return null;
    } else {
      if (matchingControl.errors && matchingControl.errors['passwordMismatch']) {
        delete matchingControl.errors['passwordMismatch'];
        matchingControl.setErrors(Object.keys(matchingControl.errors).length === 0 ? null : matchingControl.errors);
      }
      return null;
    }
  };
}

