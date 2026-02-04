import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AbstractControl, FormControl, ReactiveFormsModule } from '@angular/forms';
import { FormControlErrorComponent } from "../form-control-error/form-control-error.component";

@Component({
  selector: 'app-custom-input',
  templateUrl: './custom-input.component.html',
  imports: [ReactiveFormsModule, CommonModule, FormControlErrorComponent]
})
export class CustomInputComponent {
  @Input() control!: AbstractControl | null;

  @Input() label: string = '';

  @Input() inputId: string = '';

  @Input() type: string = 'text';

  @Input() placeholder: string = '';

  get formControl(): FormControl {
    return this.control as FormControl;
  }
}
