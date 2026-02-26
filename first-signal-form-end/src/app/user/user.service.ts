import { Injectable } from '@angular/core';
import { UserProfile } from './user-profile';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  // Fake API implementation for now
  async save(value: UserProfile) {
    console.log('Saving data: ', JSON.stringify(value));
    const resp = { status: 200, message: 'Success' };
    await new Promise(r => setTimeout(r, 2000));
    return resp;
  }

  // If working with RxJS, use firstValueFrom() or lastValueFrom()
  // async save2(value: UserProfile) {
  //   const result = this.http.post<any>(this.apiUrl, value);

  //   // Convert the Observable to a Promise and await the result
  //   try {
  //     const response = await firstValueFrom(result);
  //     return response;
  //   } catch (error) {
  //     // Handle the error here
  //     console.error('Error creating post:', error);
  //     throw error; // Re-throw or handle as needed
  //   }
  // }
}
