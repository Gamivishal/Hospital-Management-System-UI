/* eslint-disable no- */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component,inject,OnInit } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';

import { BaseService } from 'src/app/services/base.service';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonModule,  } from '@angular/common';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { AppConstant } from 'src/app/demo/baseservice/baseservice.service';

import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-facilitytype',
  standalone: true,
  imports: [CommonModule,SharedModule],
  templateUrl: './facilitytype.component.html',
  styleUrls: ['./facilitytype.component.scss']
})
export class FacilityTypeComponent implements OnInit{
  lstFacilitytype:any[]=[];
  paginatedList: any[] = []; // Paginated data
  isShowList:boolean=true;
  selectedfacilityTypeId: number | null = null;  // Store selected hospital ID for update



 
  http=inject(HttpClient)

  constructor(private baseService: BaseService,
    private toastr: ToastrService) {}

  // life cycle event
  ngOnInit() {
     this.createFormGroup();
     this.getFacilityTypes();
     //this.AddFacilityTypes();

    }
  
    facilityTypeFormGroup:FormGroup
    // Pagination properties
    currentPage: number = 1; //currect page number
    itemsPerPage: number = AppConstant.RecordPerPage;
    totalPages: number = 0; //total page
    pageNumbers: number[] = [];//list
    URL=AppConstant.url

    createFormGroup(){

      this.facilityTypeFormGroup = new FormGroup({
        facilityTypeID:new FormControl(0,[Validators.required]),
        facilityName:new FormControl(null,[Validators.required,Validators.minLength(3)]),


      })
    }
    checkRequired(controlName:any)
    {
      return this.facilityTypeFormGroup.controls[controlName].errors?.['required'];
    }


    checkminlength(controlName:any)
    {
       return this.facilityTypeFormGroup.controls[controlName].errors?.['minlength'];
    }

    getFacilityTypes(){
      this.baseService.GET <any>(this.URL+"TblFacilityTypes/GetAll").subscribe(response=>{
      console.log("Get Response:", response);
      this.lstFacilitytype = response.data;
      this.totalPages = Math.ceil(this.lstFacilitytype.length / this.itemsPerPage); // FIX: Update total pages
      this. Paginationrecord();//update list
      this.PageNumber(); // FIX: Update page numbers
    });
}

AddFacilityType(){
    this.baseService.POST(this.URL+"TblFacilityTypes/Add",this.facilityTypeFormGroup.getRawValue())
      .subscribe({
        next: (response:any) => {
        if (response.statusCode === 200) {
        this.toastr.success(response.message, 'Success');
        console.log("POST Response:", response);
        this.getFacilityTypes();
        this.isShowList = true;
        this.facilityTypeFormGroup.reset({
          facilityTypeID: 0,
          facilityName: ''
        });
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
  editFacilityType(facilitytype: any) {
    this.selectedfacilityTypeId = facilitytype.facilityTypeID;
    this.isShowList = false; //showList
    this.facilityTypeFormGroup.patchValue({
      facilityTypeID: facilitytype.facilityTypeID, // ID
      facilityName: facilitytype.facilityName // NAME
    });
  }

  updateFacilityType() {


    this.baseService.PUT(this.URL+"TblFacilityTypes/Update",this.facilityTypeFormGroup.getRawValue()) // No ID in the This.URL
      .subscribe({
        next: (response: any) => {
          if (response.statusCode === 200) {
            this.toastr.success(response.message, 'Success');
          console.log("PUT Response:", response);
          this.getFacilityTypes();
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

    onDelete(facilityTypeID: number){
      this.baseService.DELETE(this.URL+"TblFacilityTypes/Delete?id=" + facilityTypeID).subscribe({
        next: (response: any) => {
          if (response.statusCode === 200) {
            this.toastr.success(response.message, 'Success');
        console.log("DELETE Response:", response);
        this.getFacilityTypes();
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
  this.paginatedList = this.lstFacilitytype.slice(startIndex, endIndex);
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



