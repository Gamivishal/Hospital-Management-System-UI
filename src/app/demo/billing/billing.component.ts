import { Component,inject, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { BaseService } from 'src/app/services/base.service';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppConstant } from 'src/app/demo/baseservice/baseservice.service';



@Component({
  selector: 'app-billing',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss']
})
export class billingComponent implements OnInit {
billings: any[]=[];
patientlist :any[];
Treatmentcodelist :any[];
paginatedList: any[] = [];
paymentMethods: any[] = [];
currentPage: number = 1;
totalPages: number = 1;
totalRecords: number = 5;
itemsPerPage: number = AppConstant.RecordPerPage;
pageNumbers: number[] = [];
isShowList:boolean=true;
selectedbillingId: number | null = null;
URL=AppConstant.url
http = inject(HttpClient);

constructor(
  private baseService: BaseService,
  private toastr: ToastrService
) {}
   ngOnInit() {
    this.getbill();
    this.createFormGroup();
    this.getTreatmentCode();
    this.getdropdown();
    this.getPaymentMethods();

   }
   billingfmGroup:FormGroup;

     createFormGroup()
     {
      this.billingfmGroup = new FormGroup({
        //billingId: new FormControl(0),
        //patientId:new FormControl(),
        //patientName: new FormControl('', [Validators.required]),
        PatientId: new FormControl(0, [Validators.required]),
        paymentMethod: new FormControl('', [Validators.required]),
        billDate: new FormControl('', [Validators.required]),
        TreatmentDetailsId: new FormControl(0, [Validators.required])
      });

     }

     checkRequired(controlName:any)
     {
      return this.billingfmGroup.controls[controlName].errors?.['required'];
     }

    checkminlength(controlName:any)
    {
      return this.billingfmGroup.controls[controlName].errors?.['minlength'];
    }

    getbill() {
          this.baseService.GET<any>(this.URL+"TblBill/GetAll").subscribe({
          next: (response) => {
          console.log("GET Response:", response);
          this.billings = response.data;
          this.totalRecords = this.billings.length;
          this.totalPages = Math.ceil(this.billings.length / this.itemsPerPage); // FIX: Update total pages
          this.currentPage = 1;
          this.PageNumber();
          this.Paginationrecord();
          },
          });
    }
    getdropdown() {
      this.baseService.GET<any>(this.URL + "GetDropDownList/FillPatientName").subscribe({
        next: (response) => {
          this.patientlist = response.data;
        },
        error: (err) => {
          console.error("Failed to fetch patient list", err);
        }
      });
    }

    getTreatmentCode() {
      this.baseService.GET<any>(this.URL + "GetDropDownList/FillTreatmentCode").subscribe({
        next: (response) => {
          this.Treatmentcodelist = response.data;
        },
        error: (err) => {
          console.error("Failed to fetch patient list", err);
        }
      });
    }


    getPaymentMethods() {
      this.baseService.GET<any>(this.URL + "GetDropDownList/FillPaymentMethod").subscribe({
        next: (response) => {
          this.paymentMethods = response.data;
        },
        error: (err) => {
          console.error("Failed to fetch payment methods", err);
        }
      });
    }

    addbilling() {
        this.baseService.POST(this.URL+"TblBill/Add", this.billingfmGroup.getRawValue()).subscribe({
        next: (response:any) => {
        if (response.statusCode === 200) {
        this.toastr.success(response.message, 'Success');
        console.log("POST Response:", response);
        this.getbill();
        this.isShowList = true;
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


onDelete(billingId: number){
  this.baseService.DELETE(this.URL + "TblBill/Delete?id=" + billingId)
  .subscribe({
    next: (response: any) => {
      if (response.statusCode === 200) {
        this.toastr.success(response.message, 'Success');
        this.getbill();
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

///PAGINATION STOP
Paginationrecord() {
  const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  const endIndex = startIndex + this.itemsPerPage;
  this.paginatedList = this.billings.slice(startIndex, endIndex);
  console.log("Paginated List:", this.paginatedList);
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



