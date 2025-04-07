/* eslint-disable @typescript-eslint/no-explicit-any */

import { Component,inject, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { BaseService } from 'src/app/services/base.service';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppConstant } from 'src/app/demo/baseservice/baseservice.service';



@Component({
  selector: 'app-hospitaldepartment',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './hospitaldepartment.component.html',
  styleUrls: ['./hospitaldepartment.component.scss']
})
export class hospitaldepartmentComponent implements OnInit {
hospitaldepartments: any[]=[];
paginatedList: any[] = [];
isShowList:boolean=true;
selectedHospitalId: number | null = null;
http = inject(HttpClient);

constructor(
  private baseService: BaseService,
  private toastr: ToastrService
) {}
   ngOnInit() {
    this.getDept();
    this.createFormGroup();

   }
   hospitaldeptfmGroup:FormGroup;
   currentPage: number = 1; //currect page number
   itemsPerPage: number = AppConstant.RecordPerPage; //total data in page
   totalPages: number = 0; //total page
   pageNumbers: number[] = [];//list
   URL=AppConstant.url
     createFormGroup()
     {
      this.hospitaldeptfmGroup = new FormGroup({
        hospitalDepartmentId: new FormControl(0, [Validators.required]),
        departmentName: new FormControl('', [Validators.required, Validators.minLength(3)]),

      });
     }

     checkRequired(controlName:any)
     {
      return this.hospitaldeptfmGroup.controls[controlName].touched && this.hospitaldeptfmGroup.controls[controlName].errors?.['required'];
     }

    checkminlength(controlName:any)
    {
      return this.hospitaldeptfmGroup.controls[controlName].touched && this.hospitaldeptfmGroup.controls[controlName].errors?.['minlength'];
    }

    getDept() {
          this.baseService.GET<any>(this.URL+"TblHospitalDept/GetAll").subscribe({
          next: (response) => {
          console.log("GET Response:", response);
          this.hospitaldepartments = response.data;
          this.totalPages = Math.ceil(this.hospitaldepartments.length / this.itemsPerPage); // FIX: Update total pages
          this. Paginationrecord();//update list
          this.PageNumber(); // FIX: Update page numbers
          this.currentPage = 1; // Reset to first page when new data loads
          },
          });
    }
    addHospital() {
        this.baseService.POST(this.URL+"TblHospitalDept/Add", this.hospitaldeptfmGroup.getRawValue()).subscribe({
        next: (response:any) => {
        if (response.statusCode === 200) {
        this.toastr.success(response.message, 'Success');
        console.log("POST Response:", response);
        this.getDept();
        this.isShowList = true;
  }
  else {
    this.toastr.error(response.message, 'Error');
  }
},
error: () => {
  this.toastr.error('Failed to update ', 'Error');
}

});
}
editHospital(hospital: any) {
  this.selectedHospitalId = hospital.hospitalDepartmentId;
  this.isShowList = false;
  this.hospitaldeptfmGroup.patchValue({
    hospitalDepartmentId: hospital.hospitalDepartmentId,
   departmentName: hospital.departmentName
  });
}

updateHospital() {
  this.baseService.PUT(this.URL + "TblHospitalDept/Update", this.hospitaldeptfmGroup.getRawValue())
  .subscribe({
    next: (response: any) => {
      if (response.statusCode === 200) {
        this.toastr.success(response.message, 'Success');
        this.getDept();
        this.isShowList = true;
      } else {
        this.toastr.error(response.message, 'Error');
      }
    },
    error: () => {
      this.toastr.error('Failed to update ', 'Error');
    }
  });
}


onDelete(hospitalDepartmentId: number){
  this.baseService.DELETE(this.URL + "TblHospitalDept/DeleteByID?id=" + hospitalDepartmentId)
  .subscribe({
    next: (response: any) => {
      if (response.statusCode === 200) {
        this.toastr.success(response.message, 'Success');
        this.getDept();
        this.isShowList = true;
      } else {
        this.toastr.error(response.message, 'Error');
      }
    },
    error: () => {
      this.toastr.error('Failed to delete ', 'Error');
    }
  });
}

//record for the page
Paginationrecord() {
  const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  const endIndex = startIndex + this.itemsPerPage;
  this.paginatedList = this.hospitaldepartments.slice(startIndex, endIndex);
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
}



