/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component,OnInit} from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { BaseService } from 'src/app/services/base.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AppConstant } from 'src/app/demo/baseservice/baseservice.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-hospitaltype',
  standalone: true,
  imports: [SharedModule],

  templateUrl:'./hospitaltype.component.html',
  styleUrls: ['./hospitaltype.component.scss']
})
export  class hospitaltypeComponent implements OnInit {
  hospitallist: any [] = [];
          // PAGINATION
  paginatedList: any[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  totalRecords: number = 0;
  itemsPerPage: number = AppConstant.RecordPerPage;
  pageNumbers: number[] = [];


  isShowList:boolean=true;
  selectedHospitalId: number | null = null;
 URL=AppConstant.url;


  constructor(
    private baseService: BaseService,private toastr: ToastrService ) {

  }

    ngOnInit() {
      this.createFormGroup();
      this.gethospitaltypelist();


    }



     hospitalTypefmGroup:FormGroup;

     createFormGroup()
     {
      this.hospitalTypefmGroup = new FormGroup({
        HospitalTypeID: new FormControl(0, [Validators.required]),
        HospitalType: new FormControl(null, [Validators.required,Validators.minLength(3)])
      })
     }


     checkRequired(controlName:any)
     {
      return this.hospitalTypefmGroup.controls[controlName].touched &&  this.hospitalTypefmGroup.controls[controlName].errors?.['required'];
     }


     checkminlength(controlName:any)
     {
        return this.hospitalTypefmGroup.controls[controlName].touched &&  this.hospitalTypefmGroup.controls[controlName].errors?.['minlength']
     }

  gethospitaltypelist() {
    this.baseService.GET<any>(this.URL+"TblHospitalType/GetAll").subscribe(response => {
      this.hospitallist = response.data || [];
      this.totalRecords = this.hospitallist.length;
      this.totalPages = Math.ceil(this.totalRecords / this.itemsPerPage);
      this.PageNumber();
      this.Paginationrecord();
    });
  }


  addHospital() {

    this.baseService.POST(this.URL+"TblHospitalType/Add", this.hospitalTypefmGroup.getRawValue()).subscribe({
        next: (response:any) => {
        if (response.statusCode === 200) {
        this.toastr.success(response.message, 'Success');
        console.log("POST Response:", response);
        this.gethospitaltypelist();
        this.hospitalTypefmGroup.reset({ HospitalTypeID: 0 });
        this.isShowList = true;
        this.currentPage=1;
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
      this.selectedHospitalId = hospital.hospitalTypeID;
      this.isShowList = false;
      this.hospitalTypefmGroup.patchValue({
        HospitalTypeID: hospital.hospitalTypeID,
       HospitalType: hospital.hospitalType
      });
    }

    updateHospital() {


      this.baseService.PUT(this.URL+"TblHospitalType/Update",this.hospitalTypefmGroup.getRawValue()) // No ID in the URL
        .subscribe({
          next: (response: any) => {
            if (response.statusCode === 200) {
              this.toastr.success(response.message, 'Success');
            console.log("PUT Response:", response);
            this.gethospitaltypelist();
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

        onDelete(hospitalTypeID: number){
          this.baseService.DELETE(this.URL+"TblHospitalType/Delete?id=" + hospitalTypeID).subscribe({
            next: (response: any) => {
              if (response.statusCode === 200) {
                this.toastr.success(response.message, 'Success');
            console.log("DELETE Response:", response);
            this.gethospitaltypelist();
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


//PAGINATION STOP
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
