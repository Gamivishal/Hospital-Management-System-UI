/* eslint-disable @typescript-eslint/no-explicit-any */
//* eslint-disable @typescript-eslint/no-unused-vars */
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { BaseService } from 'src/app/services/base.service';
import { AppConstant } from 'src/app/demo/baseservice/baseservice.service';
import { ToastrService } from 'ngx-toastr';
import * as CryptoJS from 'crypto-js';  // Import CryptoJS

@Component({
  selector: 'app-auth-signin',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './auth-signin.component.html',
  styleUrls: ['./auth-signin.component.scss']
})
export default class AuthSigninComponent {
  constructor(private baseService: BaseService,private router: Router,private toastr: ToastrService) {}

  email: string = '';
  password: string = '';
  objlogin:any;
  URL=AppConstant.url

  // AES 256
  encryptPassword(password: string): string {
    const key = CryptoJS.enc.Utf8.parse('12345678901234567890123456789012');
    const iv = CryptoJS.enc.Utf8.parse('1234567890123456');
    return CryptoJS.AES.encrypt(password, key, { iv }).toString();
  }

  OnLogin(){


const encryptedPassword = this.encryptPassword(this.password);
const apiurl = this.URL + `TblUser/ValidateCredential?email=${encodeURIComponent(this.email)}&password=${encodeURIComponent(encryptedPassword)}`;



    this.baseService.GET<any>(apiurl).subscribe(response=>{

      console.log("GET Response:", response);
      this.objlogin = response.data;


      if(response?.data  && response.statusCode === 200){
        //localStorage.setItem('data', response?.data || '');
        localStorage.setItem('data',JSON.stringify(response?.data));
        console.log("Token stored in localstorage:", response?.data);


        this.router.navigate(['/dashboard']);
        this.toastr.success(response.message);
      } else {
        this.toastr.error(response.message, 'Invalid credentials');
      }
    })
  }


}
