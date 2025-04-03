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
      Email: new FormControl(null, [Validators.required]),
      Password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
      MobilNumber: new FormControl(null, [Validators.required]),
      DOB: new FormControl(null, [Validators.required]),
      Gender: new FormControl(null, [Validators.required]),
      Address: new FormControl(null, [Validators.required]),
      Blood_Group: new FormControl(null, [Validators.required]),
      Emergency_Contact: new FormControl(null, [Validators.required]),
      Medical_History: new FormControl(null),
      UserId: new FormControl(null, [Validators.required]),
      RoleId: new FormControl(null, [Validators.required]),


    })
  }
  ngOnInit(){
    this.createFormGroup();
    this.signup()
  }

  checkRequired(controlName: any) {
    return this.singupformgoup.controls[controlName].errors?.['required'];
  }

  checkMinLength(controlName: any) {
    return this.singupformgoup.controls[controlName].errors?.['minlength'];
  }


    signup() {

      this.baseService.POST(this.URL+"TblPatient/Add", this.singupformgoup.getRawValue())
        .subscribe(response => {
          console.log("POST Response:", response);

        });
      }
    }
