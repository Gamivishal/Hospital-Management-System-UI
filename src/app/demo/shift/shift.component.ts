/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component,OnInit } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';

//import { PaginationComponent } from 'src/app/theme/shared/components/pagination/pagination.component';

import { BaseService } from 'src/app/services/base.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AppConstant } from 'src/app/demo/baseservice/baseservice.service';

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
      this.addShifts();
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
      return this.shiftfmGroup.controls[controlName].errors?.['required'];
    }


    checkminlength(controlName:any)
    {
       return this.shiftfmGroup.controls[controlName].errors?.['minlength'];
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
        .subscribe(response => {
          console.log("POST Response:", response);
          this.getShifts(); // Refresh list
           // Switch to list view

          this.shiftfmGroup.reset({
            ShiftId: 0,
            Shiftname: ''

          })
          this.isShowList = true;
          this.currentPage = 1;

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
          next: response => {
            console.log("PUT Response:", response);
            this.getShifts();
            //this.shiftfmGroup.reset();
            this.isShowList = true;
            // this.selectedHospitalId = null;
          },

        });
    }


    onDelete(shiftId: number){
      this.baseService.DELETE(this.URL+"TblShift/Delete?id=" + shiftId).subscribe(response => {
        console.log("DELETE Response:", response);
        this.getShifts();
        this.isShowList = true;
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



