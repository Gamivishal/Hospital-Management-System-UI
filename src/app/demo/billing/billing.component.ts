import { Component,inject, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { BaseService } from 'src/app/services/base.service';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppConstant } from 'src/app/demo/baseservice/baseservice.service';
import * as jsPDF from 'jspdf';
import { ActivatedRoute } from '@angular/router';




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
 // PAGINATION
 paginatedList: any[] = [];
 currentPage: number = 1;
 totalPages: number = 1;
 totalRecords: number = 0;
 itemsPerPage: number = AppConstant.RecordPerPage;
 pageNumbers: number[] = [];

isShowList:boolean=true;
selectedbillingId: number | null = null;
URL=AppConstant.url
http = inject(HttpClient);

constructor(
  private baseService: BaseService,
  private toastr: ToastrService,
  private route: ActivatedRoute
) {}
   ngOnInit() {
    this.getbill();
    this.createFormGroup();
    const admitionId = this.route.snapshot.paramMap.get('id');
  if (admitionId) {
    this.billingfmGroup.patchValue({
      treatmentDetailsId: parseInt(admitionId)
    });
    this.isShowList = false;
  }
   }

   billingfmGroup:FormGroup;

// -PDF CODE

   public downloadRowAsPDF(department: any) {
    const doc = new jsPDF('p', 'pt', 'a4');


    // const user = [
    //   "Full Name: John Doe",
    //   "Total Amount: 1500",
    //   "Payment Method: Credit Card",
    //   "Bill Date: 2025-04-08",
    // ];

    const user = [
      `Full Name: ${department.patientName}`,
      `Total Amount: ${department.totalAmount}`,
      `Payment Method: ${department.paymentMethod}`,
      `Bill Date: ${department.billDate}`,
    ];

    let y = 40;
    doc.setFontSize(12);
    user.forEach(line => {
      doc.text(line, 40, y);
      y += 20;
    });

    doc.save(`${department.patientName}.pdf`);
  }

//  -END


     createFormGroup()
     {
      const today = new Date().toISOString().split('T')[0];
      this.billingfmGroup = new FormGroup({
        billId: new FormControl(0, [Validators.required]),
        paymentMethod: new FormControl('', [Validators.required]),
        billDate: new FormControl(today, [Validators.required]),
        treatmentDetailsId: new FormControl(0, [Validators.required]),
        totalAmount: new FormControl(0, [Validators.required])
      });
      console.log("Form Initialized:", this.billingfmGroup.value);
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
      this.totalPages = Math.ceil(this.totalRecords / this.itemsPerPage);
      this.PageNumber();
      this.Paginationrecord();
          },
          });
    }
    addbilling() {
      const data = this.billingfmGroup.getRawValue();
      console.log("Submitting Billing Data:", data); // ✅ Debug

      this.baseService.POST(this.URL + "TblBill/Add", data).subscribe({
        next: (response: any) => {
          if (response.statusCode === 200) {
            this.toastr.success(response.message, 'Success');
            this.getbill();
            this.isShowList = true;
            this.currentPage=1;
          } else {
            this.toastr.error(response.message, 'Error');
          }
        },
        error: (err) => {
          this.toastr.error('Failed', 'Error');
          console.error("POST Error:", err);
        }
      });
    }

//PAGINATION STOP
Paginationrecord() {
  const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  const endIndex = startIndex + this.itemsPerPage;
  this.paginatedList = this.billings.slice(startIndex, endIndex);
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



