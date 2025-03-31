/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component,inject,OnInit } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { BaseService } from 'src/app/services/base.service';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';



@Component({
  selector: 'app-roomtypeess',
  standalone: true,
  imports: [SharedModule],
  templateUrl:'./roomtype.component.html',
  styleUrls: ['./roomtype.component.scss']
})
export  class RoomTypesComponent implements OnInit {
  //lstroomtype: any [] = [];
  constructor(private baseService: BaseService) {}
  isShowList:boolean=true;
  roomtypepost : any ={
      "createBy": 0,
      "createdOn": "",
      "updateBy": 0,
      "updateOn": "",
      "isActive": true,
      "versionNo": 0,
      "roomTypeId": 0,
      "roomType": ""
 }
 lstroomtype: any
  // http=inject(HttpClient)

  

     ngOnInit() {
      this.createFormGroup();
      this.getRoomType();
      this.AddRoomType();
      // this.roomTypefmGroup.patchValue({
      //   HospitalType:'Naitik',
      //   HospitalTypeID:1
      // });
     }

     roomTypefmGroup:FormGroup;

     createFormGroup()
     {
      this.roomTypefmGroup = new FormGroup({
        roomTypeId: new FormControl(0, [Validators.required]),
        roomType: new FormControl(null, [Validators.required,Validators.minLength(4)]),
        // lastName: new FormControl('', []),
        // address: new FormControl('', []),
        // age: new FormControl('', []),
        // income: new FormControl('', [])
      })
     }
     


    //  checkRequired(controlName:any)
    //  {
    //    return this.roomTypefmGroup.controls[controlName].errors['required'];
    //  }


    //  checkminlength(controlName:any)
    //   {
    //     return this.roomTypefmGroup.controls[controlName].errors['minlength']!=null;
    //   }




    checkRequired(controlName:any)
    {
     return this.roomTypefmGroup.controls[controlName].errors?.['required'];
    }


    checkminlength(controlName:any)
    {
       return this.roomTypefmGroup.controls[controlName].errors?.['minlength']
    }



     getRoomType(){
       this.baseService.GET<any>("https://localhost:7272/api/TblRoomType/GetAll").subscribe(response=>{
       console.log("GET Response:", response);
       this.lstroomtype = response.data;
       });
      }

      AddRoomType() 
      {
       this.baseService.POST("https://localhost:7272/api/TblRoomType/Add", this.roomTypefmGroup.getRawValue())
       .subscribe(response => {
        console.log("POST Response:", response);
        this.getRoomType(); // Refresh list
        this.isShowList = true; 
       });
      }

}
