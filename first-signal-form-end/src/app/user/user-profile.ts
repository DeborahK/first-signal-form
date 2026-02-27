import { hidden, minLength, pattern, required, schema, validate } from "@angular/forms/signals";

export interface UserProfile {
  firstName: string;
  lastName: string;
  userType: 'employee' | 'guest' | '';
  isFullTime: boolean;
  employeeNumber: string;
}

export const initialData: UserProfile = {
  firstName: '',
  lastName: '',
  userType: '',
  isFullTime: false,
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
  required(rootPath.userType, { message: 'User type is required' });
  pattern(rootPath.employeeNumber, /^[A-Z]{2}-\d{4}$/, { message: 'Employee number is of the form AA-####' });
  hidden(rootPath.employeeNumber, ctx => ctx.valueOf(rootPath.userType) !== 'employee');
  validate(rootPath.employeeNumber, (ctx) => checkEmployeeNumber(ctx.value(), ctx.valueOf(rootPath.isFullTime)));
});

// If full time, the employee number must be < 5000
function checkEmployeeNumber(value: string, isFullTime: boolean) {
  if (!isFullTime) return null;
  const lastFour = value.slice(-4);
  if (Number(lastFour) < 5000) return null;
  return {
    kind: 'invalidEmployeeNumber',
    message: 'Invalid employee number for a full-time employee'
  }
}