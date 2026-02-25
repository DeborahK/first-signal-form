import { hidden, minLength, pattern, required, schema } from "@angular/forms/signals";

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
    required(rootPath.lastName, { message: 'Last name is required' });
    minLength(rootPath.lastName, 2, { message: 'Last name must be at least 2 characters' });
    required(rootPath.employeeNumber, {
      message: 'Employee number is required for all employees',
      when: ctx => ctx.valueOf(rootPath.userType) === 'employee'
    });
    hidden(rootPath.employeeNumber, ctx => ctx.valueOf(rootPath.userType) !== 'employee');
    pattern(rootPath.employeeNumber, /^[A-Z]{2}-\d{4}$/, { message: 'Employee number is of the form AA-####'})
});