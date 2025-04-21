/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component,OnInit } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';

import { BaseService } from 'src/app/services/base.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AppConstant } from 'src/app/demo/baseservice/baseservice.service';
import { ToastrService } from 'ngx-toastr';
import { DatatableComponent } from 'src/app/Common/datatable/datatable.component';
@Component({
  selector: 'app-patientdoctormapping',
  standalone: true,
  imports: [CommonModule,SharedModule,DatatableComponent],
  templateUrl: './patientdoctormapping.component.html',
  styleUrls: ['./patientdoctormapping.component.scss']
})
export class patientdoctormappingComponent implements OnInit {
  constructor(private baseService: BaseService,
    private toastr: ToastrService) {}
  isShowList:boolean=true;
  selectedTreatmentName: string = '';
  doctorList: any[] = [];
  TreatmentcodeList: any[] = [];
  patientList: any[] = [];
  paginatedList: any[] = []; // Paginated data
  selectedpateintDoctormappingId: number | null = null;  // Store selected shift ID for update
  URL=AppConstant.url



  objpentientdoctor:any
    // life cycle event
    ngOnInit() {
      this.createFormGroup();
      this.getPatientDoctor();
      //this.addShifts();
      this.getdoctor();
      this.getpatient();
      this.getTreatmentcode();
      this.selectedTreatmentName = '';
      //this.onDelete();

      // this.shiftfmGroup.patchValue({
      //   HospitalType:'Naitik',
      //   HospitalTypeID:1
      // });

      // this.petientdoctorfmGroup.get('TreatmentDetailsId')?.valueChanges.subscribe((id: number) => {
      //   const selected = this.TreatmentcodeList.find(item => item.id === id);
      //   this.selectedTreatmentName = selected ? selected.name : '';
      // });

    }
    petientdoctorfmGroup:FormGroup;
// Page NAvigation
currentPage: number = 1; //currect page number
itemsPerPage: number =AppConstant.RecordPerPage;  //total data in page
totalPages: number = 0; //total page
pageNumbers: number[] = [];//list
//URL=AppConstant.url



    createFormGroup()
    {
     this.petientdoctorfmGroup = new FormGroup({
      pateintDoctormappingId: new FormControl(0, [Validators.required]),
      //patientName: new FormControl(null, [Validators.required,Validators.minLength(4)]),
      //PatientId: new FormControl(0, [Validators.required]),
      UserId: new FormControl(0, [Validators.required]),
      TreatmentDetailsId: new FormControl('', [Validators.required]),
      //IsActive: new FormControl(true)

      
       // lastName: new FormControl('', []),
       // address: new FormControl('', []),
       // age: new FormControl('', []),
       // income: new FormControl('', [])
     })
    }

    checkRequired(controlName:any)
    {
      return this.petientdoctorfmGroup.controls[controlName].touched &&this.petientdoctorfmGroup.controls[controlName].errors?.['required'];
    }


    checkminlength(controlName:any)
    {
      return this.petientdoctorfmGroup.controls[controlName].touched && this.petientdoctorfmGroup.controls[controlName].errors?.['minlength'];
    }


    getPatientDoctor()
    {
      this.baseService.GET<any>(this.URL+"TblPateintDoctormapping/GetAll").subscribe(response=>{
        console.log("GET Response:", response);
        this.objpentientdoctor = response.data;
        this.totalPages = Math.ceil(this.objpentientdoctor.length / this.itemsPerPage); // FIX: Update total pages
        this. Paginationrecord();//update list
        this.PageNumber(); // FIX: Update page numbers
        //this.updatePagination();
      });
    }


    getdoctor() {
      this.baseService.GET<any>(this.URL+"GetDropDownList/FillDocterName").subscribe(Response=>{
        console.log("GET Response:", Response);
        this.doctorList = Response.data;
      });
    }

    getpatient() {
      this.baseService.GET<any>(this.URL+"GetDropDownList/FillPatientName").subscribe(Response=>{
        console.log("GET Response:", Response);
        this.patientList = Response.data;
        console.log("Patients:", this.patientList);
      });
    }

    getTreatmentcode() {
      this.baseService.GET<any>(this.URL+"GetDropDownList/FillTreatmentCode").subscribe(Response=>{
        console.log("GET Response:", Response);
        this.TreatmentcodeList = Response.data;
      });
    }

    // onTreatmentChange(event: any) {
    //   const selectedId = +event.target.value;
    //   const selected = this.TreatmentcodeList.find(t => t.id === selectedId);
    //   this.selectedTreatmentName = selected ? selected.name : '';
    // }

    onTreatmentNameChange(event: any) {
      const selectedName = event.target.value;
      const selectedTreatment = this.TreatmentcodeList.find(item => item.name === selectedName);
    
      if (selectedTreatment) {
        this.petientdoctorfmGroup.patchValue({
          TreatmentDetailsId: selectedTreatment.id
        });
      }
    }
    

    addPatientdoctor() {
      console.log(this.petientdoctorfmGroup.getRawValue())
      this.baseService.POST(this.URL+"TblPateintDoctormapping/Add", this.petientdoctorfmGroup.getRawValue())
        .subscribe({
          next: (response:any) => {
          if (response.statusCode === 200) {
          this.toastr.success(response.message, 'Success');
          console.log("POST Response:", response);
          this.getPatientDoctor(); // Refresh list
           // Switch to list view
           this.isShowList = true;
           this.currentPage = 1;
          this.petientdoctorfmGroup.reset({
            pateintDoctormappingId: 0,
            PatientId: '',
            UserId: '',
            TreatmentDetailsId: '',
            //IsActive: true
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

    editpatient(patient: any) {
      this.selectedpateintDoctormappingId = patient.pateintDoctormappingId;
      this.isShowList = false; //showList
      this.petientdoctorfmGroup.patchValue({
        pateintDoctormappingId: patient.pateintDoctormappingId, // ID
        UserId: patient.userId,     // NAME
        TreatmentDetailsId: patient.treatmentDetailsId
      });
    }
    updatePatientDoctor() {


      this.baseService.PUT(this.URL+"TblPateintDoctormapping/Update",this.petientdoctorfmGroup.getRawValue()) // No ID in the URL
        .subscribe({
          next: (response: any) => {
            if (response.statusCode === 200) {
              this.toastr.success(response.message, 'Success');
            console.log("PUT Response:", response);
            this.getPatientDoctor();
            //this.shiftfmGroup.reset();
            this.isShowList = true;
            // this.selectedHospitalId = null;
          } else {
            this.toastr.error(response.message, 'Error');
          }
        },
        error: () => {
          this.toastr.error('Failed to update ', 'Error');
        }
      });
    }

    onEditpatient(patient: any) {
      this.editpatient(patient);
    }


    onDeletepatient(pateintDoctormappingId: number){
      this.baseService.DELETE(this.URL+"TblPateintDoctormapping/Delete?id=" + pateintDoctormappingId).subscribe({
        next: (response: any) => {
          if (response.statusCode === 200) {
            this.toastr.success(response.message, 'Success');
        console.log("DELETE Response:", response);
        this.getPatientDoctor();
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


    Paginationrecord() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      this.paginatedList = this.objpentientdoctor.slice(startIndex, endIndex);
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



