import { Component,OnInit } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';


import { BaseService } from 'src/app/services/base.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shift',
  standalone: true,
  imports: [CommonModule,SharedModule],
  templateUrl: './shift.component.html',
  styleUrls: ['./shift.component.scss']
})
export class shiftComponent implements OnInit {
  constructor(private baseService: BaseService) {}
  isShowList:boolean=true;

  hopitaltypepost : any ={
    "createBy": 0,
    "createdOn": "",
    "updateBy": 0,
    "updateOn": "",
    "isActive": true,
    "versionNo": 0,
    "shiftId": 0,
    "startTime": "",
    "endTime": "",
    "shiftname": ""
   }

  objshift:any
    // life cycle event
    ngOnInit() {
      this.createFormGroup();
      this.getShifts();
      this.addShifts();
      
      // this.shiftfmGroup.patchValue({
      //   HospitalType:'Naitik',
      //   HospitalTypeID:1
      // });
     
    }
    shiftfmGroup:FormGroup;

    createFormGroup()
    {
     this.shiftfmGroup = new FormGroup({
      ShiftId: new FormControl(0, [Validators.required]),
      Shiftname: new FormControl(null, [Validators.required,Validators.minLength(4)]),
       // lastName: new FormControl('', []),
       // address: new FormControl('', []),
       // age: new FormControl('', []),
       // income: new FormControl('', [])
     })
    }

    checkRequired(controlName:any)
    {
      return this.shiftfmGroup.controls[controlName].errors['required'];
    }


    checkminlength(controlName:any)
    {
       return this.shiftfmGroup.controls[controlName].errors['minlength']!=null;
    }


    getShifts()
    {
      this.baseService.GET<any>("https://localhost:7272/api/TblShift/GetAll").subscribe(response=>{
        console.log("GET Response:", response);
        this.objshift = response.data;
      });
    }

    addShifts() {

      this.baseService.POST("https://localhost:7272/api/TblShift/Add", this.shiftfmGroup.getRawValue())
        .subscribe(response => {
          console.log("POST Response:", response);
          this.getShifts(); // Refresh list
          this.isShowList = true; // Switch to list view
  
  
  
        });
  
    }
}
