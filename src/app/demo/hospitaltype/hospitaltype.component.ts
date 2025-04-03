/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component,OnInit} from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { BaseService } from 'src/app/services/base.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AppConstant } from 'src/app/demo/baseservice/baseservice.service';

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


  constructor(
    private baseService: BaseService ) {

  }

    ngOnInit() {
      this.createFormGroup();
      this.gethospitaltypelist();
      this.addHospital();


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
      return this.hospitalTypefmGroup.controls[controlName].errors?.['required'];
     }


     checkminlength(controlName:any)
     {
        return this.hospitalTypefmGroup.controls[controlName].errors?.['minlength']
     }

  gethospitaltypelist() {
    this.baseService.GET<any>("https://localhost:7272/api/TblHospitalType/GetAll").subscribe(response => {
      this.hospitallist = response.data || [];
      this.totalRecords = this.hospitallist.length;
      this.totalPages = Math.ceil(this.totalRecords / this.itemsPerPage);
      this.PageNumber();
      this.Paginationrecord();
    });
  }


  addHospital() {

    this.baseService.POST("https://localhost:7272/api/TblHospitalType/Add", this.hospitalTypefmGroup.getRawValue())
      .subscribe(response => {
        console.log("POST Response:", response);

        this.gethospitaltypelist();
        this.hospitalTypefmGroup.reset({ HospitalTypeID: 0 });
        this.isShowList = true;
        this.currentPage=1;
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


      this.baseService.PUT("https://localhost:7272/api/TblHospitalType/Update",this.hospitalTypefmGroup.getRawValue()) // No ID in the URL
        .subscribe(response => {
            console.log("PUT Response:", response);
            this.gethospitaltypelist();
            this.isShowList = true;


        });
      }

        onDelete(hospitalTypeID: number){
          this.baseService.DELETE("https://localhost:7272/api/TblHospitalType/Delete?id=" + hospitalTypeID).subscribe(response => {
            console.log("DELETE Response:", response);
            this.gethospitaltypelist();
            this.isShowList = true;
          });
        }

        updatePagination() {
          this.PageNumber();
          this.Paginationrecord();
        }

        Paginationrecord() {
          const startIndex = (this.currentPage - 1) * this.itemsPerPage;
          const endIndex = Math.min(startIndex + this.itemsPerPage, this.totalRecords);
          this.paginatedList = this.hospitallist.slice(startIndex, endIndex);
        }

        PageNumber() {
          const startPage = 1; // Always start with page 1
          const maxPagesToShow = 3;

          this.pageNumbers = [];
          for (let i = startPage; i <= Math.min(this.totalPages, maxPagesToShow); i++) {
            this.pageNumbers.push(i);
          }
        }

        nextpage(page: number) {
          this.currentPage = Math.max(1, Math.min(page, this.totalPages));
          this.Paginationrecord();
          this.PageNumber();
        }
      }
