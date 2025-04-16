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
        employeeshiftMappingId:new FormControl(0,[Validators.required]),
        userId: new FormControl(null, [Validators.required]),  
        shiftId: new FormControl(null, [Validators.required]),
        employeeshiftMappingStartingDate: new FormControl(null, [Validators.required]),
        employeeshiftMappingEndingDate: new FormControl(null, [Validators.required])
      });
    }
    
    
    // resetForm() {
    //   this.empshiftmappingfmGroup.reset();
    //   this.empshiftmappingfmGroup.patchValue({ employeeshiftMappingId: 0 });
    //   this.employeeshiftMappingId = null;
    // }

    resetForm(){
      this.isShowList = false;
      this.createFormGroup();
      this.employeeshiftMappingId = null;
    }
    
    

     checkRequired(controlName:any)
    {
     return this.empshiftmappingfmGroup.controls[controlName].touched && this.empshiftmappingfmGroup.controls[controlName].errors?.['required'];
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
       this. Paginationrecord();
       this.PageNumber(); 
       });
      }




      AddEmpShift() {
        this.baseService.POST(this.URL+"TblEmployeeshiftMapping/Add", this.empshiftmappingfmGroup.getRawValue())
          .subscribe({
            next: (response:any) => {
            if (response.statusCode === 200) {
            console.log("POST Response:", response);
            this.getEmpShiftMapping();  
            this.Paginationrecord();  
            this.isShowList = true;
            this.currentPage = 1;
          }
          else {
            this.toastr.error(response.message, 'Error');
          }
        },
        error: () => {
          this.toastr.error('Failed to Add ', 'Error');
        }
        
        });
        }
    


          editEmpShift(item: any) {
            debugger
              this.employeeshiftMappingId = item.employeeshiftMappingId;
              this.isShowList = false;

              const dateobj  = new Date(item.employeeshiftMappingStartingDate);
              const formatdate = dateobj.toISOString().slice(0,10);
              const dateonj1 = new Date (item.employeeshiftMappingEndingDate);
              const formatdate1 = dateonj1.toISOString().slice(0,10);
              this.empshiftmappingfmGroup.patchValue({
                employeeshiftMappingId:item.employeeshiftMappingId,
                userId: item.userId,
                shiftId: item.shiftId,
               employeeshiftMappingStartingDate:formatdate,
                employeeshiftMappingEndingDate: formatdate1,
              });
            }



      updateEmpShift() {
        debugger
        this.baseService.PUT(this.URL+"TblEmployeeshiftMapping/Update", this.empshiftmappingfmGroup.getRawValue())
          .subscribe({
            next: (response:any) => {
            if (response.statusCode === 200) {
            console.log("PUT Response:", response);
            this.getEmpShiftMapping();
            this.isShowList = true;
            this.currentPage = 1; 
          }
          else {
            this.toastr.error(response.message, 'Error');
          }
        },
        error: () => {
          this.toastr.error('Failed to Update ', 'Error');
        }
        
        });
        }



      onDelete(employeeshiftMappingId: number) {
        this.baseService.DELETE(this.URL+"TblEmployeeshiftMapping/delete?id=" + employeeshiftMappingId)
          .subscribe({
            next: (response:any) => {
            if (response.statusCode === 200) {
            console.log("DELETE Response:", response);
            this.getEmpShiftMapping(); 
          }
          else {
            this.toastr.error(response.message, 'Error');
          }
        },
        error: () => {
          this.toastr.error('Failed to Delete ', 'Error');
        }
        
        });
        }
    
  
}
