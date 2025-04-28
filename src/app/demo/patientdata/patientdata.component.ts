import { Component, inject, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { BaseService } from 'src/app/services/base.service';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup,Validators} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppConstant } from 'src/app/demo/baseservice/baseservice.service';
import { DatatableComponent } from 'src/app/Common/datatable/datatable.component';

@Component({
  selector: 'app-patientdata',
  standalone: true,
  imports: [SharedModule, DatatableComponent],
  templateUrl: './patientdata.component.html',
  styleUrls: ['./patientdata.component.scss']
})
export class PatientDataComponent implements OnInit {
  patients: any[] = [];
  patientlist :any[];
  // PAGINATION
  paginatedList: any[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  totalRecords: number = 0;
  itemsPerPage: number = AppConstant.RecordPerPage;
  pageNumbers: number[] = [];

  isShowList: boolean = true;
  bloodGroups: string[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  selectedPatientId: number = 0;
  selectUserid: number = 0
  URL = AppConstant.url;
  http = inject(HttpClient);

  tableHeaders = [
    { label: 'Patient ID', key: 'patientId' },
    { label: 'Full Name', key: 'fullName' },
    { label: 'DOB', key: 'dob'},
    { label: 'Gender', key: 'gender' },
    { label: 'Address', key: 'address' },
    { label: 'Blood Group', key: 'blood_Group' },
    { label: 'Emergency Contact', key: 'emergency_Contact' },
    { label: 'Medical History', key: 'medical_History' },
    { label: 'Created By', key: 'createdBy' },
    { label: 'Created On', key: 'createdOn' },
    { label: 'Updated By', key: 'updatedBy' },
    { label: 'Updated On', key: 'updatedOn' },
    { label: 'Is Active', key: 'isActive' }
  ];


  constructor(
    private baseService: BaseService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.getPatients();
    //this.patientFormGroup();
    this.getdropdown();

  }

  patientFormGroup = new FormGroup({
    fullName: new FormControl(''),
    email: new FormControl(''),
    // password: new FormControl(''),
    mobileNumber: new FormControl('',[
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(10),
      Validators.pattern(/^[0-9]*$/)
    ]),
    dob: new FormControl(''),
    gender: new FormControl(''),
    address: new FormControl(''),
    blood_Group: new FormControl(''),
    emergency_Contact: new FormControl(''),
    medical_History: new FormControl(''),

  });
  checkValidation(controlName: string) {
    const control = this.patientFormGroup.controls[controlName];
    if (control.errors) {
      if (control.errors['minlength']) {
        return 'Minimum length is ' + control.errors['minlength'].requiredLength + ' digits.';
      }
      if (control.errors['maxlength']) {
        return 'Maximum length is ' + control.errors['maxlength'].requiredLength + ' digits.';
      }
      if (control.errors['pattern']) {
        return 'Only numbers are allowed.';
      }
    }
    return null;
  }




  getPatients() {
    this.baseService.GET<any>(this.URL + "TblPatient/GetAll").subscribe({
      next: (response) => {
        this.patients = response.data;
        this.totalRecords = this.patients.length;
        this.totalPages = Math.ceil(this.totalRecords / this.itemsPerPage);
        this.PageNumber();
        this.Paginationrecord();

      }
    });
  }
getdropdown(){
  this.baseService.GET<any>(this.URL + "GetDropDownList/FillPatientName").subscribe({
    next: (response) => {
      this.patientlist = response.data;
    }
  });

}
  editPatient(patient: any) {
    this.selectUserid = patient.userId;
    this.selectedPatientId = patient.patientId;
    console.log('UserId:', this.selectUserid); // should print number, not undefined

    console.log('UserId:', this.selectUserid);
  console.log('PatientId:', this.selectedPatientId);
    this.isShowList = false;
    this.patientFormGroup.patchValue(patient);
  }

  updatePatient() {
    const updateData = {
      ...this.patientFormGroup.getRawValue(),
      userId: this.selectUserid,
      patientId: this.selectedPatientId,
      updatedBy: this.selectUserid,
      updatedOn: new Date(),
      isActive: true
    };

    this.baseService.PUT(this.URL + "TblPatient/Update", updateData)
      .subscribe({
        next: (response: any) => {
          if (response.statusCode === 200) {
            this.toastr.success(response.message, 'Success');
            this.getPatients();
            this.isShowList = true;
          } else {
            this.toastr.error(response.message, 'Error');
          }
        },
        error: (err) => {
          console.error('Update error:', err);
          this.toastr.error('Failed to update', 'Error');
        }
      });
  }


  onDelete(UserId: number){
    this.baseService.DELETE(this.URL + "TblPatient/Delete?UserId=" + UserId)
    .subscribe({
      next: (response: any) => {
        if (response.statusCode === 200) {
          this.toastr.success(response.message, 'Success');
          this.getPatients();
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

  onTableAction(event: { action: string; row: any }) {
    const actionHandlers: { [key: string]: () => void } = {
      edit: () => this.editPatient(event.row),
      delete: () => this.onDelete(event.row.UserId),
    };
  
    const actionKey = event.action.toLowerCase();
  
    if (actionHandlers[actionKey]) {
      actionHandlers[actionKey]();
    } else {
      console.warn('Unknown action:', event.action);
    }
  }


//PAGINATION STOP
Paginationrecord() {
  const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  const endIndex = startIndex + this.itemsPerPage;
  this.paginatedList = this.patients.slice(startIndex, endIndex);
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

