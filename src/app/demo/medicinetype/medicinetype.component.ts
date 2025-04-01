import { Component,inject,OnInit } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';

import { BaseService } from 'src/app/services/base.service';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-medicinetype',
  standalone: true,
  imports: [CommonModule,SharedModule],
  templateUrl: './medicineType.component.html',
  styleUrls: ['./medicineType.component.scss']
})
export class MedicineTypeComponent implements OnInit{
  medicinetypelist:any[]=[];
  paginatedList: any[] = []; // Paginated data
  isShowList:boolean=true;
  selectedmedicineTypeId: number | null = null;  // Store selected hospital ID for update
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

  constructor(private baseService: BaseService) {}
 
  // life cycle event
  ngOnInit() {
     this.createFormGroup();
     this.getMedicineTypes();
     this.AddMedicineTypes();
     
    }

    medicineTypeFormGroup:FormGroup
    // Pagination properties
    currentPage: number = 1; //currect page number
    itemsPerPage: number = 5; //total data in page
    totalPages: number = 0; //total page
    pageNumbers: number[] = [];//list

    createFormGroup(){

      this.medicineTypeFormGroup = new FormGroup({
        medicineTypeID:new FormControl(0,[Validators.required]),
        typeName:new FormControl(null,[Validators.required,Validators.minLength(3)]),


      })
    }
    checkRequired(controlName:any)
    {
      return this.medicineTypeFormGroup.controls[controlName].errors?.['required'];
    }


    checkminlength(controlName:any)
    {
       return this.medicineTypeFormGroup.controls[controlName].errors?.['minlength'];
    }

  getMedicineTypes(){
    this.baseService.GET <any>("https://localhost:7272/api/TblMedicineType/GetAll").subscribe(response=>{
      console.log("Get Response:", response);
      this. medicinetypelist = response.data;
      this.totalPages = Math.ceil(this.medicinetypelist.length / this.itemsPerPage); // FIX: Update total pages
    this. Paginationrecord();//update list
     this.PageNumber(); // FIX: Update page numbers
    });
}

  AddMedicineTypes(){
    
    //Medicine:any [] = [];
  

    this.baseService.POST("https://localhost:7272/api/TblMedicineType/Add",this.medicineTypeFormGroup.getRawValue())
      .subscribe(response => {
        console.log("POST Response:", response);
        this.getMedicineTypes();
        this.isShowList = true;
    });

  }
  // editMedicineTypes(medicinetype: any) {
  //   this.selectedmedicineTypeId = medicinetype.medicineTypeID;
  //   this.isShowList = false; //showList
  //   this.medicineTypeFormGroup.patchValue({
  //     medicineTypeID: medicinetype.medicineTypeID, // ID
  //     typeName: medicinetype.typeName // NAME
  //   });
  // }


  editMedicineTypes(medicinetype: any) {
    this.selectedmedicineTypeId = medicinetype.medicineTypeID;
    this.isShowList = false; // show list
    this.medicineTypeFormGroup.patchValue({
      medicineTypeID: medicinetype.medicineTypeID, // ID
      typeName: medicinetype.typeName // NAME
    });
  }
  

  // updateMedicineTypes() {
  
  //   this.baseService.PUT("https://localhost:7272/api/TblMedicineType/Update",this.medicineTypeFormGroup.getRawValue())// No ID in the URL
  //     .subscribe({
  //       next: response => {
  //         console.log("PUT Response:", response);
  //         this.getMedicineTypes();
  //         this.isShowList = true;
  //         // this.selectedHospitalId = null;
  //       },

  //     });
  //   }

  updateMedicineTypes() {
    this.baseService.PUT("https://localhost:7272/api/TblMedicineType/Update", this.medicineTypeFormGroup.getRawValue())
      .subscribe({
        next: response => {
          console.log("PUT Response:", response);
          this.getMedicineTypes();
          this.isShowList = true;
        },
      });
  }
  

    onDelete(medicineTypeID: number){
      this.baseService.DELETE("https://localhost:7272/api/TblMedicineType/Delete?Id=" + medicineTypeID).subscribe(response => {
        console.log("DELETE Response:", response);
        this.getMedicineTypes();
        this.isShowList = true;
      });
    }


//record for the page
Paginationrecord() {
  const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  const endIndex = startIndex + this.itemsPerPage;
  this.paginatedList = this.medicinetypelist.slice(startIndex, endIndex);
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
    


