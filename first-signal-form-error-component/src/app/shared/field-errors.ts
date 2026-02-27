import { Component, effect, input } from '@angular/core';
import { FieldTree } from '@angular/forms/signals';

@Component({
  selector: 'app-field-errors',
  standalone: true,
  template: `
    @let f = errorField();
    @if (f().invalid() && f().touched()) {
      <div class="alert alert-danger">
        @for (error of f().errors(); track error.kind) {
          <div>{{ error.message }}</div>
        }
      </div>
    }
  `,
  styleUrl: './field-errors.css'
})
export class FieldErrorsComponent {
  errorField = input.required<FieldTree<string>>();
}