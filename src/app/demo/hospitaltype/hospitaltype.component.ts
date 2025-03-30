
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component,inject,OnInit } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { BaseService } from 'src/app/services/base.service';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';



@Component({
  selector: 'app-hospitaltype',
  standalone: true,
  imports: [SharedModule],
  templateUrl:'./hospitaltype.component.html',
  styleUrls: ['./hospitaltype.component.scss']
})
export  class hospitaltypeComponent implements OnInit {
[x: string]: any;
  hospitallist: any [] = [];
  isShowList:boolean=true;
 hopitaltypepost : any ={
  "createBy": 0,
  "createdOn": "",
  "updateBy": 0,
  "updateOn": "",
  "isActive": true,
  "versionNo": 0,
  "hospitalTypeID": 0,
  "hospitalType": ""

 }
  http=inject(HttpClient)

  constructor(private baseService: BaseService) {}

     ngOnInit() {
      this.createFormGroup();
      this.gethospitaltypelist();
      this.addHospital();
      // this.hospitalTypefmGroup.patchValue({
      //   HospitalType:'Naitik',
      //   HospitalTypeID:1
      // });
     }

     hospitalTypefmGroup:FormGroup;


     createFormGroup()
     {
      this.hospitalTypefmGroup = new FormGroup({
        HospitalTypeID: new FormControl(0, [Validators.required]),
        HospitalType: new FormControl(null, [Validators.required,Validators.minLength(3)])
      })
     }


     checkRequired(controlName:any)
     {
      return this.hospitalTypefmGroup.controls[controlName].errors?.['required'];
     }


     checkminlength(controlName:any)
     {
        return this.hospitalTypefmGroup.controls[controlName].errors?.['minlength']
     }




  gethospitaltypelist(){     this.baseService.GET<any>("https://localhost:7272/api/TblHospitalType/GetAll").subscribe(response=>{
    console.log("GET Response:", response);
    this.hospitallist = response.data || []
});
  }

  addHospital() {

    this.baseService.POST("https://localhost:7272/api/TblHospitalType/Add", this.hospitalTypefmGroup.getRawValue())
      .subscribe(response => {
        console.log("POST Response:", response);
        this.gethospitaltypelist(); // Refresh list
       this.isShowList = true; // Switch to list view
      });

  }




}

