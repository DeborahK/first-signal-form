import { Component, signal } from '@angular/core';
import { UserProfileForm } from './user/user-profile-form/user-profile-form';

@Component({
  selector: 'app-root',
  imports: [UserProfileForm],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('first signal form');
}
