import { Component, computed, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
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
  userProfileModel = signal<UserProfile>(initialData);
  fullName = computed(() =>
    (this.userProfileModel().firstName + ' ' + this.userProfileModel().lastName).trim());

  // Declare a form from the model and logic rules schema
  userProfileForm = form(this.userProfileModel, userProfileSchema);

}
