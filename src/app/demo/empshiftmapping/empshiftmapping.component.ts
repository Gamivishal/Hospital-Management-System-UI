/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component,inject,OnInit } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { BaseService } from 'src/app/services/base.service';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AppConstant } from 'src/app/demo/baseservice/baseservice.service';
import { ToastrService } from 'ngx-toastr';




@Component({
  selector: 'app-empshiftmapping',
  standalone: true,
  imports: [SharedModule],
  templateUrl:'./empshiftmapping.component.html',
  styleUrls: ['./empshiftmapping.component.scss']
})
export  class empshiftmapping implements OnInit {
  lstempshiftmapping: any [] = [];
  isShowList:boolean=true;
  employeeshiftMappingId: number | null = null;
  lstShifts: any[] = [];
  lstUserNames: any[] = [];

//   roomtypepost : any ={
//       "createBy": 0,
//       "createdOn": "",
//       "updateBy": 0,
//       "updateOn": "",
//       "isActive": true,
//       "versionNo": 0,
//       "roomTypeId": 0,
//       "roomType": ""
//  }
//  lstroomtype: any
  // http=inject(HttpClient)

  // roomTypeId: number = null;

  constructor(private baseService: BaseService,
      private toastr: ToastrService) {}

     ngOnInit() {
      this.createFormGroup();
      this.getShifts();
      this.getUserNames();
      this.getEmpShiftMapping();
      // this.AddEmpShift();
    
     }

     empshiftmappingfmGroup:FormGroup;

     // Page NAvigation 
     paginatedList: any[] = [];
     currentPage: number = 1;
     totalPages: number = 1;
     totalRecords: number = 0;
     itemsPerPage: number = AppConstant.RecordPerPage;
     pageNumbers: number[] = [];
     URL = AppConstant.url




     createFormGroup() {
      this.empshiftmappingfmGroup = new FormGroup({
        userId: new FormControl(null, [Validators.required]),  
        shiftId: new FormControl(null, [Validators.required]),
        employeeshiftMappingStartingDate: new FormControl(null, [Validators.required]),
        employeeshiftMappingEndingDate: new FormControl(null, [Validators.required])
      });
    }
    
    
    
    

     checkRequired(controlName:any)
    {
     return this.empshiftmappingfmGroup.controls[controlName].errors?.['required'];
    }


    checkminlength(controlName:any)
    {
       return this.empshiftmappingfmGroup.controls[controlName].errors?.['minlength']
    }


   //PAGINATION STOP
Paginationrecord() {
  const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  const endIndex = startIndex + this.itemsPerPage;
  this.paginatedList = this.lstempshiftmapping.slice(startIndex, endIndex);
}

//page number
PageNumber() {
  this.pageNumbers = [];
  for (let i = 1; i <= Math.min(this.totalPages, 3); i++) {
    this.pageNumbers.push(i);
  }
}
//change page
nextpage(page: number) {
  if (page >= 1 && page <= this.totalPages) {
    this.currentPage = page;
    this. Paginationrecord();
  }
}



    getShifts() {
      this.baseService.GET<any>(this.URL+"GetDropDownList/FillShift")
        .subscribe(response => {
          console.log("Shift:", response);
          this.lstShifts = response.data;
        });
    }

    

   


    getUserNames() {
      this.baseService.GET<any>(this.URL+"GetDropDownList/FillUserName")
        .subscribe(response => {
          console.log("User Name:", response);
          this.lstUserNames = response.data;
        });
    }


     getEmpShiftMapping(){
       this.baseService.GET<any>(this.URL+"TblEmployeeshiftMapping/GetAll").subscribe(response=>{
       console.log("GET Response:", response);
       this.lstempshiftmapping = response.data;
       this.totalPages = Math.ceil(this.lstempshiftmapping.length / this.itemsPerPage); // FIX: Update total pages
       this. Paginationrecord();//update list
       this.PageNumber(); // FIX: Update page numbers
       });
      }


      
  

      // AddEmpShift() {
      //   this.baseService.POST(this.URL+"TblEmployeeshiftMapping/Add", this.empshiftmappingfmGroup.getRawValue())
      //     .subscribe(response => {
      //       console.log("POST Response:", response);
      //       this.getEmpShiftMapping(); 
      //       this.empshiftmappingfmGroup.reset({
      //         userId: null,
      //         shiftId: null,
      //         employeeshiftMappingStartingDate: null,
      //         employeeshiftMappingEndingData: null
      //       });
      //       this.isShowList = true;
      //     });
      //   }



      AddEmpShift() {
        this.baseService.POST(this.URL+"TblEmployeeshiftMapping/Add", this.empshiftmappingfmGroup.getRawValue())
          .subscribe(response => {
            console.log("POST Response:", response);
            this.getEmpShiftMapping();  
            this.Paginationrecord();  
            this.isShowList = true;
          });
    }
    


          editEmpShift(item: any) {
              this.employeeshiftMappingId = item.employeeshiftMappingId;
              this.isShowList = false;

              this.empshiftmappingfmGroup.patchValue({
                userId: item.userId,
                shiftId: item.shiftId,
                employeeshiftMappingStartingDate: item.employeeshiftMappingStartingDate,
                employeeshiftMappingEndingDate: item.employeeshiftMappingEndingDate
              });
            }

      
    

      updateEmpShift() {
        this.baseService.PUT(this.URL+"TblEmployeeshiftMapping/Update", this.empshiftmappingfmGroup.getRawValue())
          .subscribe(response => {
            console.log("PUT Response:", response);
            this.getEmpShiftMapping();
            this.isShowList = true;
            this.currentPage = 1; 
          });
      }



      onDelete(employeeshiftMappingId: number) {
        this.baseService.DELETE(this.URL+"TblEmployeeshiftMapping/delete?id=" + employeeshiftMappingId)
          .subscribe(response => {
            console.log("DELETE Response:", response);
            this.getEmpShiftMapping(); 
          });
    }
    
  
}
