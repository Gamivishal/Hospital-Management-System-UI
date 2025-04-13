/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component,OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppConstant } from 'src/app/demo/baseservice/baseservice.service';
import { BaseService } from 'src/app/services/base.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';


@Component({
  selector: 'app-auth-signup',
  standalone: true,
  imports: [RouterModule,SharedModule],
  templateUrl: './auth-signup.component.html',
  styleUrls: ['./auth-signup.component.scss']
})
export default class AuthSignupComponent implements OnInit {
  singupformgoup: FormGroup;
  URL=AppConstant.url



  constructor(
    private baseService: BaseService ) {

  }


  createFormGroup(){
    this.singupformgoup= new FormGroup({
      FullName: new FormControl(null, [Validators.required, Validators.minLength(3)]),
      Email: new FormControl(null, [Validators.required,Validators.email,Validators.maxLength(100)]),
      Password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
      ConfirmPassword: new FormControl(null, [
        Validators.required,
        this.matchPasswordValidator('Password')
      ]),

      MobilNumber: new FormControl(null, [Validators.required,Validators.pattern(/^[6-9]\d{9}$/),Validators.maxLength(10)]),
      DOB: new FormControl(null, [Validators.required,control => new Date(control.value)?.getTime() > Date.now() ? { futureDate: true } : null]),
      Gender: new FormControl(null, [Validators.required]),
      Address: new FormControl(null, [Validators.required]),
      Blood_Group: new FormControl(null, [Validators.required]),
      Emergency_Contact: new FormControl(null, [Validators.required,Validators.pattern(/^[6-9]\d{9}$/),Validators.maxLength(10)]),
      Medical_History: new FormControl(null),
    })
  }
  ngOnInit(){
    this.createFormGroup();
    //this.signup()
  }

  checkRequired(controlName: any) {
    return this.singupformgoup.controls[controlName].touched && this.singupformgoup.controls[controlName].errors?.['required'];
  }
  checemail(controlName: any) {
    return this.singupformgoup.controls[controlName].errors?.['email'];
  }

  checkMinLength(controlName: any) {
    return this.singupformgoup.controls[controlName].touched && this.singupformgoup.controls[controlName].errors?.['minlength'];
  }

  checkMaxLength(controlName: any) {
    return this.singupformgoup.controls[controlName].touched &&
           this.singupformgoup.controls[controlName].errors?.['maxlength'];
  }


  checkMobileNumber(controlName: any) {
    return this.singupformgoup.controls[controlName].touched &&
    this.singupformgoup.controls[controlName].errors?.['pattern'] &&
    /^[0-5]/.test(this.singupformgoup.controls[controlName].value);
  }


  checkFutureDate(controlName: any) {
    return this.singupformgoup.controls[controlName].touched &&
      this.singupformgoup.controls[controlName].errors?.['futureDate'];
  }
  passwordsMatchValidator(group: FormGroup) {
    return group.get('Password')?.value === group.get('ConfirmPassword')?.value ? null : { passwordsMismatch: true };

  }
  matchPasswordValidator(passwordControlName: string) {
    return (control: FormControl) => {
      return control?.parent?.get(passwordControlName)?.value === control.value
        ? null
        : { passwordMismatch: true };
    };
  }








    signup() {

      this.baseService.POST(this.URL+"TblPatient/Add", this.singupformgoup.getRawValue())
        .subscribe(response => {
          console.log("POST Response:", response);

        });
      }


    }
