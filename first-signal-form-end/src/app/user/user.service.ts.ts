import { Injectable } from '@angular/core';
import { UserProfile } from './user-profile';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  // Fake API implementation for now
  save(value: UserProfile) {
    console.log('Saving data: ', JSON.stringify(value));
    return Promise.resolve({ status: 200, message: 'Success' });
  }
}
