import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { BaseService } from 'src/app/services/base.service';
import { AppConstant } from 'src/app/demo/baseservice/baseservice.service';
import { ToastrService } from 'ngx-toastr';

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





  OnLogin(){
    ;
    const apiurl = this.URL+`TblUser/ValidateCredential?email=${encodeURIComponent(this.email)}&password=${encodeURIComponent(this.password)}`;

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
        this.toastr.error(response.message, 'Envalid credentials');
      } 
    })  
  }
  
  
}
