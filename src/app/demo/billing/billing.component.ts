import { Component,inject, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { BaseService } from 'src/app/services/base.service';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppConstant } from 'src/app/demo/baseservice/baseservice.service';
import * as jsPDF from 'jspdf';
import { ActivatedRoute } from '@angular/router';
import { DatatableComponent } from 'src/app/Common/datatable/datatable.component';




@Component({
  selector: 'app-billing',
  standalone: true,
  imports: [SharedModule, DatatableComponent],
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss']
})
export class billingComponent implements OnInit {
billings: any[]=[];
patientlist :any[];
TreatmentcodeList: any[] = [];
treatmentdetailsidwithnamelist:any[]=[];
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

tableHeaders = [
  { label: 'FullName', key: 'patientName' },
  { label: 'Bill ID', key: 'billid' },
  { label: 'totalAmount', key: 'totalAmount' },
  { label: 'paymentMethod', key: 'paymentMethod' },
  { label: 'billDate', key: 'billDate' },
  { label: 'Created By', key: 'createdBy' },
  { label: 'Created On', key: 'createdOn' },
  { label: 'Updated By', key: 'updatedBy' },
  { label: 'Updated On', key: 'updatedOn' },
  { label: 'Is Active', key: 'isActive' }
];


constructor(
  private baseService: BaseService,
  private toastr: ToastrService,
  private route: ActivatedRoute
) {}
   ngOnInit() {
    this.getbill();
    this.createFormGroup();
    this.gettreatmentdetailsidwithname();
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
        totalAmount: new FormControl('', [Validators.required])
      });
      console.log("Form Initialized:", this.billingfmGroup.value);
     }

     limitTotalAmount(event: any) {
      let val = event.target.value;
      if (val.replace('.', '').length > 7) {
        val = val.slice(0, 11); // 10 digits + dot (if present)
        event.target.value = val;
        this.billingfmGroup.get('totalAmount')?.setValue(val);
      }
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

    onTableAction(event: { action: string; row: any }) {
      const actionHandlers: { [key: string]: () => void } = {
        download: () => this.downloadRowAsPDF(event.row),
      };
    
      const actionKey = event.action.toLowerCase();
    
      if (actionHandlers[actionKey]) {
        actionHandlers[actionKey]();
      } else {
        console.warn('Unknown action:', event.action);
      }
    }

    gettreatmentdetailsidwithname(){
      this.baseService.GET<any>(this.URL+"GetDropDownList/FillTreatmentCode").subscribe(response => {
        console.log("GET Response:", response);
        this.treatmentdetailsidwithnamelist = response.data;
        console.log("treamentdetailslistwithname", this.treatmentdetailsidwithnamelist);
      })
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
