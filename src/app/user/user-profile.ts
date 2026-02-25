import { minLength, required, schema } from "@angular/forms/signals";

export interface UserProfile {
  firstName: string;
  lastName: string;
  userType: 'employee' | 'guest' | '';
  employeeNumber: string;
}

export const initialData: UserProfile = {
  firstName: '',
  lastName: '',
  userType: '',
  employeeNumber: ''
}

export const userProfileSchema = schema<UserProfile>(rootPath => {
  required(rootPath.firstName, { message: 'First name is required' });
  minLength(rootPath.firstName, 2, { message: 'First name must be at least 2 characters'});
  required(rootPath.lastName, { message: 'Last name is required' });
  minLength(rootPath.firstName, 2, { message: 'Last name must be at least 2 characters'});
});