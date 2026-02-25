import { Component, computed, signal } from '@angular/core';
import { disabled, form, FormField, hidden, minLength, pattern, required } from '@angular/forms/signals';
import { initialData, UserProfile, userProfileSchema } from '../user-profile';

@Component({
  selector: 'app-user-profile-form',
  imports: [FormField],
  templateUrl: './user-profile-form.html',
  styleUrl: './user-profile-form.css',
})
export class UserProfileForm {

  // Create a form model signal with form fields
  // This represents the form's data structure
  userProfileModel = signal<UserProfile>({
    firstName: '',
    lastName: '',
    userType:'',
    employeeNumber: ''
  });
  fullName = computed(() =>
    (this.userProfileModel().firstName + ' ' + this.userProfileModel().lastName).trim());

  // Declare a form from the model and logic rules schema
  userProfileForm = form(this.userProfileModel, path => {
    required(path.firstName, { message: 'First name is required' });
    required(path.lastName, { message: 'Last name is required' });
    minLength(path.firstName, 2, { message: 'Last name must be at least 2 characters' });
    required(path.employeeNumber, {
      message: 'Employee number is required for all employees',
      when: ctx => ctx.valueOf(path.userType) === 'employee'
    });
    hidden(path.employeeNumber, ctx => ctx.valueOf(path.userType) !== 'employee');
    pattern(path.employeeNumber, /^[A-Z]{2}-\d{4}$/, { message: 'Employee number is of the form AA-####'})
  });

}
