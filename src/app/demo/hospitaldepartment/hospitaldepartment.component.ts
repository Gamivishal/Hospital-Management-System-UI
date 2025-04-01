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
  imports: [SharedModule, ToastrModule],
  providers: [ToastrService, ToastService],
  templateUrl: './hospitaldepartment.component.html',
  styleUrls: ['./hospitaldepartment.component.scss']
})
export class hospitaldepartmentComponent implements OnInit {
//constructor(private baseService: BaseService,private toastr: ToastrService) {}
hospitaldepartments: any[]=[];
isShowList:boolean=true;
hospitaldeptfmGroup:FormGroup;
http = inject(HttpClient);

constructor(
  private baseService: BaseService,
  private toastService: ToastService
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


     createFormGroup()
     {
      this.hospitaldeptfmGroup = new FormGroup({
        hospitaldepartmentId: new FormControl(0, [Validators.required]),
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
          this.toastService.showSuccess('Departments loaded successfully');
        },
        error: () => {
          this.toastService.showError('Failed to load departments');
        }
            });
    }
 addHospital() {
//   debugger;
// this.hopitaldeptpost.createdOn = new Date().toISOString();
// this.hopitaldeptpost.updateOn = new Date().toISOString();

this.baseService.POST("https://localhost:7272/api/TblHospitalDept/Add", this.hospitaldeptfmGroup.getRawValue())
.subscribe({
  next: (response) => {
    console.log("POST Response:", response);
    this.toastService.handleApiResponse(200, 'Department added successfully');
    this.getDept();
    this.isShowList = true;
  },
  error: () => {
    this.toastService.handleApiResponse(400, 'Failed to add department'); // ✅ Handle error
  }
});
}


// deletehospitaldept(){
//   this.baseService.DELETE("https://localhost:7272/api/TblHospitalDept/Delete")
//   .subscribe(response => {
//     console.log("DELETE Response:", response);
//     this.getDept()
//    // this.isShowList=true;
 // });

//}

 }

