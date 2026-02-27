# Minimum steps

## 0. Run the application
Display the form so we know what we're building.

We need:
- Data binding
- Validation
- Display of validation messages
- Logic

## 1. Declare the model interface
**user-profile.ts**

Uses a string literal union
```
export interface UserProfile {
  firstName: string;
  lastName: string;
  userType: 'employee' | 'guest' | '';
  employeeNumber: string;
}
```
## 2. Declare the model signal
**user-profile-form.ts**

```
userProfileModel = signal<UserProfile>({
  firstName: '',
  lastName: '',
  userType: '',
  employeeNumber: ''
});
```

## 3. Declare the form
**user-profile-form.ts**

```
userProfileForm = form(this.userProfileModel)
```

## 4. Bind each UI element
Import the needed directive.

**user-profile-form.ts**
```
imports: [FormField],
```
**user-profile-form.html**
```
[formField]="userProfileForm.firstName"
```
Repeat for each input element.

## 5. It's all signals!
**user-profile-form.ts**
```
  fullName = computed(() =>
    (this.userProfileModel().firstName + ' ' + this.userProfileModel().lastName).trim());
```
**user-profile-form.html**
```
  <div class="card-header">
    User Profile
    @if(fullName()) {
      for {{fullName()}}
    }
  </div>
```
## 6. Run
With signals and our formField binding, we can react to state changes.

# Basic Validation

## 1. Define validation rules
Add as second argument to the form() function. Pass an arrow function that provides the root path to the form and returns an object with the validation rules.

Optionally, define the validation messages.

**user-profile-form.ts**
```
  userProfileForm = form(this.userProfileModel, (rootPath) => {
    required(rootPath.firstName, { message: 'First name is required' });
    required(rootPath.lastName, { message: 'Last name is required' });
    minLength(rootPath.lastName, 2, { message: 'Last name must be at least 2 characters' });
  })
```

## 2. Display validation messages
**user-profile-form.html | 22**
```
        @let fn = userProfileForm.firstName;
        @if (fn().invalid()) {
          <div class="alert alert-danger">
            @for (error of fn().errors(); track error.kind) {
              <div>{{ error.message }}</div>
            }
          </div>
        }
```

## 3. Run
Notice that the message appears even though the user has not yet starting typing.

## 4. Modify to add `touched()`
**user-profile-form.html**
```
@if (fn().invalid() && fn().touched()) {
```

## 5. Run
Now the error won't appear until the user touches and leaves the field. 

## 6. Repeat message for last name field.
**user-profile-form.html**
```
        @let ln = userProfileForm.lastName;
        @if (ln().invalid() && ln().touched()) {
          <div class="alert alert-danger">
            @for (error of ln().errors(); track error.kind) {
              <div>{{ error.message }}</div>
            }
          </div>
        }
``` 
## 7. Add asterisk to required fields.
**user-profile-form.html**
```
          @if (userProfileForm.firstName().required()) {
            <span class="text-danger">*</span>
          }
```
Add also to LastName field

## 8. Run
The asterisks appear.

The first and last name are validated.

# Separate logic
Move initialization and validation to separate file. (I use the interface file)

## 1. Create a constant for the initialization
**user-profile.ts**
```
export const initialData: UserProfile = {
  firstName: '',
  lastName: '',
  userType: '',
  employeeNumber: ''
}
```

## 2. Change the component to use the constant
**user-profile-form.ts**
```
  userProfileModel = signal<UserProfile>(initialData);
```

## 3. Create a schema for the validation
**user-profile.ts**
```
export const userProfileSchema = schema<UserProfile>(rootPath => {
  required(rootPath.firstName, { message: 'First name is required' });
  required(rootPath.lastName, { message: 'Last name is required' });
  minLength(rootPath.lastName, 2, { message: 'Last name must be at least 2 characters' });
});
```
Be sure to update the imports.

This is now more easily reusable.

It can even be used without a form, such as to validate a data during an import operation.

## 4. Use the schema in the form() function
**user-profile-form.ts**
```
userProfileForm = form(this.userProfileModel, userProfileSchema)
```
This dramatically simplies the component.

## 5. Run
Ensure it all still works.

# Conditional Validation
Employee number is only required if the `Employee` radio button is selected.

## 1. Add the Validation rule
**user-profile.ts**
```
  required(rootPath.employeeNumber, {
    message: 'Employee number is required for all employees',
    when: ctx => ctx.valueOf(rootPath.userType) === 'employee'
  });
```

## 2. Display validation message
**user-profile-form.html**
```
        @let en = userProfileForm.employeeNumber;
        @if (en().invalid() && en().touched()) {
          <div class="alert alert-danger">
            @for (error of en().errors(); track error.kind) {
              <div>{{ error.message }}</div>
            }
          </div>
        }
```

## 3. Add the * if required
```
            @if (userProfileForm.employeeNumber().required()) {
              <span class="text-danger">*</span>
            }
```

## 4. Run
Employee number is now required when the radio button is selected.

# Pattern Validation
Employee number must be two upper case letters, a dash, and four numbers.

## 1. Add the Validation rule
**user-profile.ts**
```
  pattern(rootPath.employeeNumber, /^[A-Z]{2}-\d{4}$/, { message: 'Employee number is of the form AA-####' });
```
Be sure to update the imports.

## 2. Run
Employee number must now match a specific format.

# Cross-field/Custom Validation
If full time, the 4 numbers at the end of the employee number must be < 5000

## 1. Create a validation function
- Return null if no error
- Otherwise return an error

**user-profile.ts**
```
function checkEmployeeNumber(value: string, isFullTime: boolean) {
  if (!isFullTime) return null;
  const lastFour = value.slice(-4);
  if (Number(lastFour) < 5000) return null;
  return {
    kind: 'invalidEmployeeNumber',
    message: 'Invalid employee number for a full-time employee'
  }
}
```
## 2. Add validate() and call the function
**user-profile-form.ts**
```
  validate(rootPath.employeeNumber, (ctx) => checkEmployeeNumber(ctx.value(), ctx.valueOf(rootPath.isFullTime)));
```

## 3. Run
Must now select one radio button.

# Display logic
enabled, disabled, hidden

Hide the employee field unless the `Employee` radio button is selected

## 1. Identify the field to be hidden

**user-profile.ts**
```
  hidden(rootPath.employeeNumber, ctx => ctx.valueOf(rootPath.userType) !== 'employee');
```
Be sure to update the imports.

This does not actually hide the field because there is no HTML attribute for that.

## 2. Check for hidden in the template
**user-profile-form.html**

Add above the div/label for the employee number
```
      @if(!userProfileForm.employeeNumber().hidden()) {
        ...
      }
```

## 3. Run
Employee field will now show/hide as needed.

# Submission

## 1. Use the new FormRoot directive (new in 21.2)

- Declarative form submission
- Eliminates boilerplate: 
  - Adding noValidate attribute
  - Binding to submit event
  - Writing submit event handler
  - Calling preventDefault() in that handler

**user-profile-form.ts**
```
  imports: [FormField, FormRoot],
```
**user-profile-form.html**
Add the FormRoot directive and bind it to the form.
```
    <form [formRoot]="userProfileForm">
```

## 2. Inject the UserService
Assuming our code to save the entered data is in a service, inject that service
```
userService = inject(UserService);
```
Don't forget to **un-comment** the code in the service.

## 3. Add submission logic to form() function
Submission:
- Marks all fields as touched
- Runs validation
- Executes submission logic

Submission information is the third argument to the form() function.

Set the submission property to an object. Set the action property to our submission action.

Call a service to save the data. Currently only supports promises.

Use firstValueFrom() to convert an Observable into a Promise. (toPromise() is now deprecated) 

**user-profile-form.ts**
```
  userProfileForm = form(this.userProfileModel, userProfileSchema, {
    submission: {
      action: async (f) => {
        await this.userService.save(f().value());
        f().reset(initialData);
      }
    }
  });
```
Then reset the form using the initialData we declared earlier.
- Resets touched
- Resets dirty
- Won't change model unless data it's passed in

The form itself now defines how submission works.

## 4. Run
Open the developer tools and view the console to see the saved data.

## 5. Add a "... saving" message
Define the default text and declare a signal for the save button text.

**user-profile-form.ts**
```
  readonly defaultText = 'Save Profile';
  saveText = signal(this.defaultText);
```
Add code to the submission to set the text into the button and to reset to the default text.

**user-profile-form.ts**
```
        this.saveText.set('... Saving');
        await this.userService.save(f().value());
        f().reset(initialData);
        this.saveText.set(this.defaultText);
```

## 6. Run
Now the button text changes so the user knows what's happening.
