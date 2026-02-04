import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-form-control-error',
  templateUrl: './form-control-error.component.html',
  imports: [],
})
export class FormControlErrorComponent {

  @Input({ required: true }) control!: AbstractControl | null;
  @Input() customMessages: { [key: string]: string } = {};

  private defaultMessages: { [key: string]: string } = {
    required: 'Este campo es obligatorio.',
    minlength: 'Debe tener un minimo de caracteres.',
    maxlength: 'Excede la longitud máxima permitida.',
    pattern: 'El formato de correo no es válido.',
    invalidEmailPattern: 'El formato de correo no es válido',
    passwordMismatch: 'Las contraseñas no coinciden',
    onlyNumbers: 'Este campo solo es numerico'
    // Puedes agregar más: pattern, min, max, etc.
  };

  errorMessage(): string {
    if (!this.control || !this.control.errors) {
      return '';
    }

    const firstErrorKey = Object.keys(this.control.errors)[0];
    const errorDetails = this.control.errors[firstErrorKey];

    if (errorDetails && typeof errorDetails === 'string') {
      return errorDetails;
    }

    let message = this.customMessages[firstErrorKey] || this.defaultMessages[firstErrorKey];

    if (!message) {
      return 'Error de validación desconocido.';
    }

    if (firstErrorKey === 'minlength' && errorDetails && errorDetails.requiredLength) {

      if (message === this.defaultMessages['minlength']) {
        return `Debe tener mínimo ${errorDetails.requiredLength} caracteres.`;
      }
    }

    if (firstErrorKey === 'maxlength' && errorDetails && errorDetails.requiredLength) {

      if (message === this.defaultMessages['maxlength']) {
        return `Debe tener máximo ${errorDetails.requiredLength} caracteres.`;
      }
    }
    return message;
  }
}
