import { Component, computed, inject, signal } from '@angular/core';
import { form, FormField, FormRoot } from '@angular/forms/signals';
import { initialData, UserProfile, userProfileSchema } from '../user-profile';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-profile-form',
  imports: [FormField, FormRoot],
  templateUrl: './user-profile-form.html',
  styleUrl: './user-profile-form.css',
})
export class UserProfileForm {
  readonly defaultText = 'Save Profile';
  saveText = signal(this.defaultText);

  // Create a form model signal with form fields
  // This represents the form's data structure
  userProfileModel = signal<UserProfile>(initialData);
  fullName = computed(() =>
    (this.userProfileModel().firstName + ' ' + this.userProfileModel().lastName).trim());

  userService = inject(UserService);

  // Declare a form from the model and logic rules schema
  userProfileForm = form(this.userProfileModel, userProfileSchema, {
    submission: {
      action: async (f) => {
        this.saveText.set('... Saving');
        await this.userService.save(f().value());
        f().reset(initialData);
        this.saveText.set(this.defaultText);
      }
    }
  });

}
