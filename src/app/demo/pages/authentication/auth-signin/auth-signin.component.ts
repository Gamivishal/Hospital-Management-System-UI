import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { BaseService } from 'src/app/services/base.service';

@Component({
  selector: 'app-auth-signin',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './auth-signin.component.html',
  styleUrls: ['./auth-signin.component.scss']
})
export default class AuthSigninComponent {
  constructor(private baseService: BaseService,private router: Router) {}

  email: string = '';
  password: string = '';
  objlogin:any;

  // ngOnInit(){
  //   this.OnLogin();
  // }



  OnLogin(){
    debugger;
    const apiurl = `https://localhost:7272/api/TblUser/ValidateCredential?email=${encodeURIComponent(this.email)}&password=${encodeURIComponent(this.password)}`;

    this.baseService.GET<any>(apiurl).subscribe(response=>{
      console.log("GET Response:", response);
      this.objlogin = response.data;


      if(response?.data){
        //localStorage.setItem('data', response?.data || '');
        localStorage.setItem('data',response?.data);
        console.log("Token stored in localstorage:", response?.data);


        this.router.navigate(['/dashboard']);
        alert("Login successfully")
      }else{
        alert("Invalid Creadentials...");
      }
      
    })  
  }
  
  
}
