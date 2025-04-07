/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component,OnInit } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';

//import { PaginationComponent } from 'src/app/theme/shared/components/pagination/pagination.component';

import { BaseService } from 'src/app/services/base.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AppConstant } from 'src/app/demo/baseservice/baseservice.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-shift',
  standalone: true,
  imports: [CommonModule,SharedModule],
  templateUrl: './shift.component.html',
  styleUrls: ['./shift.component.scss']
})
export class shiftComponent implements OnInit {
  constructor(private baseService: BaseService,
    private toastr: ToastrService) {}
  isShowList:boolean=true;
  paginatedList: any[] = []; // Paginated data
  selectedshiftId: number | null = null;  // Store selected hospital ID for update
  URL=AppConstant.url



  // hopitaltypepost : any ={
  //   "createBy": 0,
  //   "createdOn": "",
  //   "updateBy": 0,
  //   "updateOn": "",
  //   "isActive": true,
  //   "versionNo": 0,
  //   "shiftId": 0,
  //   "startTime": "",
  //   "endTime": "",
  //   "shiftname": ""
  //  }

  objshift:any
    // life cycle event
    ngOnInit() {
      this.createFormGroup();
      this.getShifts();
      //this.onDelete();

      // this.shiftfmGroup.patchValue({
      //   HospitalType:'Naitik',
      //   HospitalTypeID:1
      // });

    }
    shiftfmGroup:FormGroup;
    currentPage: number = 1; //currect page number
    itemsPerPage: number = AppConstant.RecordPerPage; //total data in page
    totalPages: number = 0; //total page
    pageNumbers: number[] = [];//list



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
      return this.shiftfmGroup.controls[controlName].touched && this.shiftfmGroup.controls[controlName].errors?.['required'];
    }


    checkminlength(controlName:any)
    {
       return this.shiftfmGroup.controls[controlName].touched && this.shiftfmGroup.controls[controlName].errors?.['minlength'];
    }


    getShifts()
    {
      //debugger;
      //console.log(localStorage.getItem('token'));
      this.baseService.GET<any>(this.URL+"TblShift/GetAll").subscribe(response=>{
        console.log("GET Response:", response);
        this.objshift = response.data;
        this.totalPages = Math.ceil(this.objshift.length / this.itemsPerPage); // FIX: Update total pages
        this. Paginationrecord();//update list
        this.PageNumber(); // FIX: Update page numbers
        //this.updatePagination();
      });
    }

    addShifts() {
      this.baseService.POST(this.URL+"TblShift/Add", this.shiftfmGroup.getRawValue())
        .subscribe({
          next: (response:any) => {
          if (response.statusCode === 200) {
          this.toastr.success(response.message, 'Success');
          console.log("POST Response:", response);
          this.getShifts(); // Refresh list
           // Switch to list view
           this.isShowList = true;
           this.currentPage = 1;
          this.shiftfmGroup.reset({
            ShiftId: 0,
            Shiftname: ''
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

    editshift(shift: any) {
      this.selectedshiftId = shift.shiftId;
      this.isShowList = false; //showList
      this.shiftfmGroup.patchValue({
        ShiftId: shift.shiftId, // ID
        Shiftname: shift.shiftname      // NAME
      });
    }
    updateshift() {


      this.baseService.PUT(this.URL+"TblShift/Update",this.shiftfmGroup.getRawValue()) // No ID in the URL
        .subscribe({
          next: (response: any) => {
            if (response.statusCode === 200) {
              this.toastr.success(response.message, 'Success');
            console.log("PUT Response:", response);
            this.getShifts();
            //this.shiftfmGroup.reset();
            this.isShowList = true;
            // this.selectedHospitalId = null;
          } else {
            this.toastr.error(response.message, 'Error');
          }
        },
        error: () => {
          this.toastr.error('Failed to update ', 'Error');
        }
      });
    }


    onDelete(shiftId: number){
      this.baseService.DELETE(this.URL+"TblShift/Delete?id=" + shiftId).subscribe({
        next: (response: any) => {
          if (response.statusCode === 200) {
            this.toastr.success(response.message, 'Success');
        console.log("DELETE Response:", response);
        this.getShifts();
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
      this.paginatedList = this.objshift.slice(startIndex, endIndex);
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



