
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component,OnInit } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { BaseService } from 'src/app/services/base.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';



@Component({
  selector: 'app-hospitaltype',
  standalone: true,
  imports: [SharedModule],
  templateUrl:'./hospitaltype.component.html',
  styleUrls: ['./hospitaltype.component.scss']
})
export  class hospitaltypeComponent implements OnInit {

  hospitallist: any [] = [];
  paginatedList: any[] = []; // Paginated data
  isShowList:boolean=true;
  selectedHospitalId: number | null = null;  // Store selected hospital ID for update
//  hopitaltypepost : any ={
//   "createBy": 0,
//   "createdOn": "",
//   "updateBy": 0,
//   "updateOn": "",
//   "isActive": true,
//   "versionNo": 0,
//   "hospitalTypeID": 0,
//   "hospitalType": ""

//  }


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
   // Pagination properties
   currentPage: number = 1; //currect page number
   itemsPerPage: number = 7; //total data in page
   totalPages: number = 0; //total page
   pageNumbers: number[] = [];//list



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
    this.totalPages = Math.ceil(this.hospitallist.length / this.itemsPerPage); // FIX: Update total pages
    this. Paginationrecord();//update list
     this.PageNumber(); // FIX: Update page numbers
});
  }


  addHospital() {

    this.baseService.POST("https://localhost:7272/api/TblHospitalType/Add", this.hospitalTypefmGroup.getRawValue())
      .subscribe(response => {
        console.log("POST Response:", response);
        this.gethospitaltypelist(); // Refresh list
       this.isShowList = true; // list view


      });


    }
    editHospital(hospital: any) {
      this.selectedHospitalId = hospital.hospitalTypeID;
      this.isShowList = false; //showList
      this.hospitalTypefmGroup.patchValue({
        HospitalTypeID: hospital.hospitalTypeID, // ID
       HospitalType: hospital.hospitalType      // NAME
      });
    }

    updateHospital() {


      this.baseService.PUT("https://localhost:7272/api/TblHospitalType/Update",this.hospitalTypefmGroup.getRawValue()) // No ID in the URL
        .subscribe({
          next: response => {
            console.log("PUT Response:", response);
            this.gethospitaltypelist();
            this.isShowList = true;
            // this.selectedHospitalId = null;
          },

        });
    }










//record for the page
Paginationrecord() {
  const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  const endIndex = startIndex + this.itemsPerPage;
  this.paginatedList = this.hospitallist.slice(startIndex, endIndex);
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



