import { Injectable } from '@angular/core';
import { UserProfile } from './user-profile';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  // Fake API implementation for now
  // If working with RxJS, use firstValueFrom() or lastValueFrom()
  async save(value: UserProfile) {
    console.log('Saving data: ', JSON.stringify(value));
    const resp = { status: 200, message: 'Success' };
    await new Promise(r => setTimeout(r, 2000));
    return resp;
  }
}
