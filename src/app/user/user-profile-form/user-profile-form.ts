import { Component, computed, signal } from '@angular/core';
import { disabled, form, FormField, minLength, required } from '@angular/forms/signals';
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
    lastName: ''
  });
  fullName = computed(() =>
    (this.userProfileModel().firstName + ' ' + this.userProfileModel().lastName).trim());

  // Declare a form from the model and logic rules schema
  userProfileForm = form(this.userProfileModel, path => {
    disabled(path.firstName, () => true);
    required(path.firstName, { message: 'First name is required' });
    minLength(path.firstName, 2, { message: 'First name must be at least 2 characters' });
    required(path.lastName, { message: 'Last name is required' });
    minLength(path.firstName, 2, { message: 'Last name must be at least 2 characters' });
  });

}
