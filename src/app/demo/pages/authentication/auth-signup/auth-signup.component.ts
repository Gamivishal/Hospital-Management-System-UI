import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  templateUrl: './auth-signup.component.html',
  styleUrls: ['./auth-signup.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    RouterModule,
    HttpClientModule,
  ],
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  showPassword = false;
  showConfirmPassword = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.createFormGroup();
  }

  createFormGroup() {
    this.signupForm = new FormGroup(
      {
        FullName: new FormControl(null, [Validators.required, Validators.minLength(3)]),
        Email: new FormControl(null, [Validators.required, Validators.email, Validators.maxLength(100)]),
        Password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
        ConfirmPassword: new FormControl(null, [Validators.required]),
        MobileNumber: new FormControl(null, [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]),
        Gender: new FormControl(null, [Validators.required]),
        DOB: new FormControl(null, [Validators.required, this.futureDateValidator]),
        Blood_Group: new FormControl(null, [Validators.required]),
        Emergency_Contact: new FormControl(null, [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]),
        Address: new FormControl(null, [Validators.required]),
        Medical_History: new FormControl(null),
      },
      { validators: this.passwordsMatchValidator }
    );
  }

  passwordsMatchValidator(group: FormGroup) {
    const password = group.get('Password')?.value;
    const confirmPassword = group.get('ConfirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  futureDateValidator(control: FormControl) {
    const today = new Date();
    const selectedDate = new Date(control.value);
    return selectedDate > today ? { futureDate: true } : null;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  checkRequired(controlName: string): boolean {
    const control = this.signupForm.get(controlName);
    return control?.hasError('required') && control?.touched;
  }

  checkMinLength(controlName: string): boolean {
    const control = this.signupForm.get(controlName);
    return control?.hasError('minlength') && control?.touched;
  }

  checkMaxLength(controlName: string): boolean {
    const control = this.signupForm.get(controlName);
    return control?.hasError('maxlength') && control?.touched;
  }

  checkMobileNumber(controlName: string): boolean {
    const control = this.signupForm.get(controlName);
    return control?.hasError('pattern') && control?.touched;
  }

  checkEmail(controlName: string): boolean {
    const control = this.signupForm.get(controlName);
    return control?.hasError('email') && control?.touched;
  }

  checkFutureDate(controlName: string): boolean {
    const control = this.signupForm.get(controlName);
    return control?.hasError('futureDate') && control?.touched;
  }

  signup() {
    // Check if the form is valid before making the API call
    if (this.signupForm.valid) {
      // Form data
      const formData = this.signupForm.value;
      console.log('Form Data:', formData); // Log the form data to see it in the console
  
      // API call to the backend
      this.http.post('https://localhost:7272/api/TblPatient/Add', formData).subscribe({
        next: (response) => {
          // Success response
          console.log('Signup successful:', response);
          alert('Signup successful!');
          this.signupForm.reset();  // Reset form after successful submission
        },
        error: (err) => {
          // Error response
          console.error('Signup failed:', err);
          alert('Signup failed. Try again later.');
        }
      });
    } else {
      // If the form is invalid, mark all fields as touched to show validation messages
      this.signupForm.markAllAsTouched();
    }
  }
  
}
