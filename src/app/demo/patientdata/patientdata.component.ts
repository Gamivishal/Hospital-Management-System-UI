import { Component, inject, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { BaseService } from 'src/app/services/base.service';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppConstant } from 'src/app/demo/baseservice/baseservice.service';

@Component({
  selector: 'app-patientdata',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './patientdata.component.html',
  styleUrls: ['./patientdata.component.scss']
})
export class PatientDataComponent implements OnInit {
  patients: any[] = [];
  patientlist :any[];
  isShowList: boolean = true;
  bloodGroups: string[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  selectedPatientId: number | null = null;
  URL = AppConstant.url;
  http = inject(HttpClient);

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
    patientName: new FormControl(''), // <-- Add this line
    patientId: new FormControl(0),
    fullName: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
    roleName: new FormControl(''),
    roleId: new FormControl(0),
    mobilNumber: new FormControl(''),
    dob: new FormControl(''),
    gender: new FormControl(''),
    address: new FormControl(''),
    blood_Group: new FormControl(''),
    emergency_Contact: new FormControl(''),
    medical_History: new FormControl(''),
    userId: new FormControl(0),
    createdBy: new FormControl(0),
    createdOn: new FormControl(new Date().toISOString()),
    updatedBy: new FormControl(0),
    updatedOn: new FormControl(new Date().toISOString()),
    isActive: new FormControl(true),
    versionNo: new FormControl(0)
  });



  getPatients() {
    this.baseService.GET<any>(this.URL + "TblPatient/GetAll").subscribe({
      next: (response) => {
        this.patients = response.data;
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
    this.selectedPatientId = patient.patientId;
    this.isShowList = false;
    this.patientFormGroup.patchValue(patient);
  }

  updatePatient() {
    this.baseService.PUT(this.URL + "TblPatient/Update", this.patientFormGroup.getRawValue())
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
}
