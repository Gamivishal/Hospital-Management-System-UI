/* eslint-disable no-debugger */
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
  selector: 'app-treatmentdetails',
  standalone: true,
  imports: [CommonModule,SharedModule],
  templateUrl: './treatmentdetails.component.html',
  styleUrls: ['./treatmentdetails.component.scss']
})
export class TreatmentdetailsComponent implements OnInit{
  treatmentdetailslist:any[]=[];
  paginatedList: any[] = []; // Paginated data
  isShowList:boolean=true;
  selectedtreatmentDetailsId: number | null = null;  // Store selected hospital ID for update
  diseaselist: any []=[];
  patientlist:any []=[];
 


  // medicinetypepost:any={
  //   "createBy":0,
  //   "cretedOn":"",
  //   "updateBy":0,
  //   "updateOn":"",
  //   "isActive": true,
  //   "versionNo":0,
  //   "medicineTypeID":0,
  //   "typeName":"",
  // }
  http=inject(HttpClient)

  constructor(private baseService: BaseService,
    private toastr: ToastrService) {}

  // life cycle event
  ngOnInit() {
     this.createFormGroup();
     this.gettreatmentdetails();
     this.getdisease();
     this.getpateint();
     
     

    }

    treatmentDetailsFormGroup:FormGroup
    // Pagination properties
    currentPage: number = 1; //currect page number
    itemsPerPage: number = AppConstant.RecordPerPage;
    totalPages: number = 0; //total page
    pageNumbers: number[] = [];//list
    URL=AppConstant.url

    createFormGroup(){

      this.treatmentDetailsFormGroup = new FormGroup({
        treatmentDetailsId:new FormControl(0,[Validators.required]),
        dieseaseTypeID:new FormControl(null,[Validators.required]),
        patientId:new FormControl(null,[Validators.required]),
        treatmentDate:new FormControl(null,[Validators.required]),
        // treatmentCode:new FormControl(null,[Validators.required])



      })
    }
    checkRequired(controlName:any)
    {
      return this.treatmentDetailsFormGroup.controls[controlName].errors?.['required'];
    }


    checkminlength(controlName:any)
    {
       return this.treatmentDetailsFormGroup.controls[controlName].errors?.['minlength'];
    }

  gettreatmentdetails(){
    this.baseService.GET <any>(this.URL+"TblTreatmentDetails/GetAll").subscribe(response=>{
      console.log("Get Response:", response);
      this.treatmentdetailslist = response.data;
      this.totalPages = Math.ceil(this.treatmentdetailslist.length / this.itemsPerPage); // FIX: Update total pages
    this. Paginationrecord();//update list
     this.PageNumber(); // FIX: Update page numbers
    });
}

  Addtreatmentdetails(){
    this.baseService.POST(this.URL+"TblTreatmentDetails/Add",this.treatmentDetailsFormGroup.getRawValue())
      .subscribe({
        next: (response:any) => {
        if (response.statusCode === 200) {
        this.toastr.success(response.message, 'Success');
        console.log("POST Response:", response);
        this.gettreatmentdetails();
        this.isShowList = true;
        this.treatmentDetailsFormGroup.reset({
          treatmentDetailsId: 0,
          dieseaseTypeID: '',
          patientId:'',
          treatmentDate:'',
          treatmentCode:'',

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
  edittreatmentdetails(treatmentdetails: any) {
    this.selectedtreatmentDetailsId = treatmentdetails.treatmentDetailsId;
    this.isShowList = false; //showList
    this.treatmentDetailsFormGroup.patchValue({
      treatmentDetailsId: treatmentdetails.treatmentDetailsId,
      dieseaseTypeID: treatmentdetails.dieseaseTypeID, // ID
      patientId: treatmentdetails.patientId, // NAME
      treatmentDate: treatmentdetails.treatmentDate,
       treatmentCode: treatmentdetails.treatmentCode

    });
  }


  updatetreatmentdetails() {
    debugger
    this.baseService.PUT(this.URL+"TblTreatmentDetails/Update",this.treatmentDetailsFormGroup.getRawValue())// No ID in the URL
      .subscribe({
        next: (response: any) => {
          if (response.statusCode === 200) {
            this.toastr.success(response.message, 'Success');
          this.gettreatmentdetails();
          this.isShowList = true;
          
          // this.medicineTypeFormGroup.reset({
          //   medicineTypeID: 0,
          //   typeName: ''
  
          //     })
            }
  
     this.currentPage = 1;
  
          // this.selectedHospitalId = null;
        }

      });
    }
    onDelete(treatmentDetailsId: number){
      this.baseService.DELETE(this.URL+"TblTreatmentDetails/Delete?Id=" + treatmentDetailsId).subscribe({
        next: (response: any) => {
          if (response.statusCode === 200) {
            this.toastr.success(response.message, 'Success');
        console.log("DELETE Response:", response);
        this.gettreatmentdetails();
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


    // getdisease() {
    //     this.baseService.GET<any>(this.URL+"GetDropDownList/FillDiseaseName").subscribe(response => {
    //       console.log("Get response:", response);
    //       // Assuming response.data contains an array of items
    //       if (response.data) {
    //         this.diseaselist = response.data; // Populate dropdown list with fetched data
    //       } else {
    //         console.error("No data found in the response!");
    //       }
    //     });
    //   }

    getdisease(){
      this.baseService.GET<any>(this.URL+"GetDropDownList/FillDiseaseName").subscribe(response => {
        console.log("GET Response:", response);
        this.diseaselist = response.data;
        console.log("disease", this.diseaselist);
      })
    }
   
    getpateint(){
      this.baseService.GET<any>(this.URL+"GetDropDownList/FillPatientName").subscribe(response => {
        console.log("GET Response:", response);
        this.patientlist = response.data;
        console.log("patient", this.patientlist);
      })
    }

    

      
   


//record for the page
Paginationrecord() {
  const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  const endIndex = startIndex + this.itemsPerPage;
  this.paginatedList = this.treatmentdetailslist.slice(startIndex, endIndex);
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



