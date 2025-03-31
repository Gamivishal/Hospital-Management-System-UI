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
  paginatedList: any[] = []; // Paginated data


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
      //this.onDelete();
      
      // this.shiftfmGroup.patchValue({
      //   HospitalType:'Naitik',
      //   HospitalTypeID:1
      // });
     
    }
    shiftfmGroup:FormGroup;
    currentPage: number = 1; //currect page number
    itemsPerPage: number = 5; //total data in page
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
        this.totalPages = Math.ceil(this.objshift.length / this.itemsPerPage); // FIX: Update total pages
        this. Paginationrecord();//update list
        this.PageNumber(); // FIX: Update page numbers
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
    onDelete(shiftId: number){
      this.baseService.DELETE("https://localhost:7272/api/TblShift/Delete?id=" + shiftId).subscribe(response => {
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



