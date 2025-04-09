import { Component,inject,OnInit } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';

import { BaseService } from 'src/app/services/base.service';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonModule, NgIfContext } from '@angular/common';




@Component({
  selector: 'app-diseasetype',
  standalone: true,
  imports: [CommonModule,SharedModule],
  templateUrl: './diseasetype.component.html',
  styleUrls: ['./diseasetype.component.scss']
})
export class DiseaseTypeComponent implements OnInit{
  diseasetypelist:any[]=[];
  paginatedList: any[] = []; // Paginated data
  isShowList:boolean=true;
  selecteddieseaseTypeID: number | null = null;  // Store selected hospital ID for update
  

  
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
     this.getDieseaseTypes();
     this.AddDieseaseTypes();
     
    }

    dieseaseTypeFormGroup:FormGroup
    // Pagination properties
    currentPage: number = 1; //currect page number
    itemsPerPage: number = 5; //total data in page
    totalPages: number = 0; //total page
    pageNumbers: number[] = [];//list

    createFormGroup(){

      this.dieseaseTypeFormGroup = new FormGroup({
        dieseaseTypeID:new FormControl(0,[Validators.required]),
        dieseaseName:new FormControl(null,[Validators.required,Validators.minLength(3)]),


      })
    }
    checkRequired(controlName:any)
    {
      return this.dieseaseTypeFormGroup.controls[controlName].errors?.['required'];
    }


    checkminlength(controlName:any)
    {
       return this.dieseaseTypeFormGroup.controls[controlName].errors?.['minlength'];
    }

  getDieseaseTypes(){
    this.baseService.GET <any>("https://localhost:7272/api/Disease/GetAll").subscribe(response=>{
      console.log("Get Response:", response);
      this. diseasetypelist = response.data;
      this.totalPages = Math.ceil(this.diseasetypelist.length / this.itemsPerPage); // FIX: Update total pages
    this. Paginationrecord();//update list
     this.PageNumber(); // FIX: Update page numbers
    });
}

  AddDieseaseTypes(){
    
    //Medicine:any [] = [];
  

    this.baseService.POST("https://localhost:7272/api/Disease/Add",this.dieseaseTypeFormGroup.getRawValue())
      .subscribe(response => {
        console.log("POST Response:", response);
        this.getDieseaseTypes();
        this.isShowList = true;

        this.dieseaseTypeFormGroup.reset({
          dieseaseTypeID: 0,
          dieseaseName: ''

            })

   this.currentPage = 1;

     
    });

  }
  editdieseaseTypes(dieseaseType: any) {
    this.selecteddieseaseTypeID = dieseaseType.dieseaseTypeID;
    this.isShowList = false; //showList
    this.dieseaseTypeFormGroup.patchValue({
      dieseaseTypeID: dieseaseType.dieseaseTypeID, // ID
      dieseaseName : dieseaseType. dieseaseName // NAME
    });
  }


  updatedieseaseTypes() {
    this.baseService.PUT("https://localhost:7272/api/Disease/Update",this.dieseaseTypeFormGroup.getRawValue())// No ID in the URL
      .subscribe({
        next: response => {
          console.log("PUT Response:", response);
          this.getDieseaseTypes();
          this.isShowList = true;
          
          this.dieseaseTypeFormGroup.reset({
            dieseaseTypeID: 0,
           dieseaseName: ''
  
              })
  
     this.currentPage = 1;
  
          // this.selectedHospitalId = null;
        },

      });
    }
    onDelete(dieseaseTypeID: number){
      this.baseService.DELETE("https://localhost:7272/api/Disease/deleteByID?id=" + dieseaseTypeID).subscribe(response => {
        console.log("DELETE Response:", response);
        this.getDieseaseTypes();
        this.isShowList = true;
      });
    }


//record for the page
Paginationrecord() {
  const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  const endIndex = startIndex + this.itemsPerPage;
  this.paginatedList = this.diseasetypelist.slice(startIndex, endIndex);
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
    


