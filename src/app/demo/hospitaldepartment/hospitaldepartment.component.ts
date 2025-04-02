import { Component,inject, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { BaseService } from 'src/app/services/base.service';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { ToastService } from 'src/app/services/toast.service';


@Component({
  selector: 'app-hospitaldepartment',
  standalone: true,
  imports: [SharedModule],// ToastrModule],
  //providers: [ToastrService, ToastService],
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
  private baseService: BaseService
  //private toastService: ToastService
) {}
   ngOnInit() {
    this.getDept();
    this.createFormGroup();
    this.addHospital();
      // this.hospitaldeptfmGroup.patchValue({
      //   Hospitaldept:'Naitik',
      //   HospitaldeptID:1
     // });
   }
   hospitaldeptfmGroup:FormGroup;
   currentPage: number = 1; //currect page number
   itemsPerPage: number = 5; //total data in page
   totalPages: number = 0; //total page
   pageNumbers: number[] = [];//list
     createFormGroup()
     {
      this.hospitaldeptfmGroup = new FormGroup({
        hospitalDepartmentId: new FormControl(0, [Validators.required]),
        departmentName: new FormControl('', [Validators.required, Validators.minLength(3)]),

      });
     }

     checkRequired(controlName:any)
     {
      return this.hospitaldeptfmGroup.controls[controlName].errors?.['required'];
     }

    checkminlength(controlName:any)
    {
      return this.hospitaldeptfmGroup.controls[controlName].errors?.['minlength'];
    }

    getDept() {
          this.baseService.GET<any>("https://localhost:7272/api/TblHospitalDept/GetAll").subscribe({
          next: (response) => {
          console.log("GET Response:", response);
          this.hospitaldepartments = response.data;
          this.totalPages = Math.ceil(this.hospitaldepartments.length / this.itemsPerPage); // FIX: Update total pages
    this. Paginationrecord();//update list
     this.PageNumber(); // FIX: Update page numbers
this.currentPage = 1; // Reset to first page when new data loads


          //this.toastService.showSuccess('Departments loaded successfully');
          },
          // error: () => {
          // this.toastService.showError('Failed to load departments');
          // }
          });
    }
    addHospital() {
//   debugger;
// this.hopitaldeptpost.createdOn = new Date().toISOString();
// this.hopitaldeptpost.updateOn = new Date().toISOString();

        this.baseService.POST("https://localhost:7272/api/TblHospitalDept/Add", this.hospitaldeptfmGroup.getRawValue())
        .subscribe({ next: (response) => {
        console.log("POST Response:", response);
        //this.toastService.handleApiResponse(200, 'Department added successfully');
        this.getDept();
        this.isShowList = true;
  },
  // error: () => {
  //   this.toastService.handleApiResponse(400, 'Failed to add department'); // ✅ Handle error
  // }
});
}
editHospital(hospital: any) {
  this.selectedHospitalId = hospital.hospitalDepartmentId;
  this.isShowList = false; //showList
  this.hospitaldeptfmGroup.patchValue({
    hospitalDepartmentId: hospital.hospitalDepartmentId, // ID
   departmentName: hospital.departmentName      // NAME
  });
}

updateHospital() {
  this.baseService.PUT("https://localhost:7272/api/TblHospitalDept/Update",this.hospitaldeptfmGroup.getRawValue()) // No ID in the URL
    .subscribe({
      next: response => {
        console.log("PUT Response:", response);
        this.getDept();
        this.isShowList = true;
        // this.selectedHospitalId = null;
      },

    });
}
onDelete(hospitalDepartmentId: number){
  this.baseService.DELETE("https://localhost:7272/api/TblHospitalDept/DeleteByID?id=" + hospitalDepartmentId).subscribe(response => {
    console.log("DELETE Response:", response);
    this.getDept();
    this.isShowList = true;
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



