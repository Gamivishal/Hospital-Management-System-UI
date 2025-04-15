/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component,inject,OnInit } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { BaseService } from 'src/app/services/base.service';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AppConstant } from '../baseservice/baseservice.service';
// import { error } from 'console';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-roomtypeess',
  standalone: true,
  imports: [SharedModule],
  templateUrl:'./empdepartmentmapping.component.html',
  styleUrls: ['./empdepartmentmapping.component.scss']
})
export  class EmpDepartmentMapping implements OnInit {
  lstempdeptmapping: any [] = [];
  paginatedList: any[] = [];
  isShowList:boolean=true;
  lstUserNames: any[] = [];
  lstDepartmentName: any[] = [];
  EmpDeptId: number | null = null;


   constructor(private baseService: BaseService,
      private toastr: ToastrService) {}

     ngOnInit() {
      this.createFormGroup();
      this.getUserNames();
      this.getDepartmentNames();
      this.getEmpDeptMapping();
    
     }

     empdepartmentmappingfmGroup:FormGroup;

     // Page NAvigation 
     currentPage: number = 1; //currect page number
     itemsPerPage: number = 5; //total data in page
     totalPages: number = 0; //total page
     pageNumbers: number[] = [];//list
     URL=AppConstant.url



     createFormGroup() {
      
      this.empdepartmentmappingfmGroup = new FormGroup({
        employeeDepartmentMappingId: new FormControl(0),
        userId: new FormControl(null, Validators.required),
        hospitalDepartmentId: new FormControl(null, Validators.required), 
      });
    }
     


     checkRequired(controlName:any)
    {
     return this.empdepartmentmappingfmGroup.controls[controlName].touched && this.empdepartmentmappingfmGroup.controls[controlName].errors?.['required'];
    }


    checkminlength(controlName:any)
    {
       return this.empdepartmentmappingfmGroup.controls[controlName].errors?.['minlength']
    }



  

    getUserNames() {
      this.baseService.GET<any>(this.URL+"GetDropDownList/FillUserName")
        .subscribe(response => {
          console.log("User Name:", response);
          this.lstUserNames = response.data;
        });
    }

    getDepartmentNames() {
      this.baseService.GET<any>(this.URL+"GetDropDownList/FillDepartmentname")
        .subscribe(response => {
          console.log("Department Name:", response);
          this.lstDepartmentName = response.data;
        });
    }




    getEmpDeptMapping(){
      this.baseService.GET<any>(this.URL+"TblEmployeeDepartmentMapping/GetAll").subscribe(response =>{
        console.log("GET Response:", response);
        this.lstempdeptmapping = response.data;
        this.totalPages = Math.ceil(this.lstempdeptmapping.length / this.itemsPerPage);
        this.Paginationrecord();
        this.PageNumber();
      });
    }





    AddEmpDeptMapping() {
      console.log(this.empdepartmentmappingfmGroup.getRawValue())
      this.baseService.POST(this.URL + "TblEmployeeDepartmentMapping/Add", this.empdepartmentmappingfmGroup.getRawValue())
        .subscribe({next: (response:any) => {
          if (response.statusCode === 200) {
            this.toastr.success(response.message, 'Success');
            this.getEmpDeptMapping();
            this.Paginationrecord(); 
            this.isShowList = true;
            this.empdepartmentmappingfmGroup.reset();
          }
          else {
            this.toastr.error(response.message, 'Error');
          }
        },
        error: () => {
          this.toastr.error('Failed to Add', 'Error');
        }
        
        });
        }

    



      editEmpDeptMapping(item: any) {  
      this.EmpDeptId = item.employeeDepartmentMappingId;
      this.isShowList = false;
      this.empdepartmentmappingfmGroup.patchValue({
        employeeDepartmentMappingId: item.employeeDepartmentMappingId,
        userId: item.userId,
        hospitalDepartmentId: item.hospitalDepartmentId
      });      
    }
    




      updateEmpDeptMapping() {
        this.baseService.PUT(this.URL + "TblEmployeeDepartmentMapping/Update", this.empdepartmentmappingfmGroup.getRawValue())
          .subscribe({next: (response:any) => {
            if (response.statusCode === 200) {
              this.toastr.success(response.message, 'Success');
            console.log("PUT Response", response)
              this.getEmpDeptMapping();
              this.isShowList = true;
              this.EmpDeptId = null;
              this.empdepartmentmappingfmGroup.reset();
            }
            else {
              this.toastr.error(response.message, 'Error');
            }
          },
          error: () => {
            this.toastr.error('Failed to Update', 'Error');
          }
          
          });
          }
      
      


      onDelete(id: number) {
        this.baseService.DELETE(this.URL + "TblEmployeeDepartmentMapping/Delete?id=" + id)
          .subscribe({next: (response:any) => {
            if (response.statusCode === 200) {
              this.toastr.success(response.message, 'Success');
            this.toastr.success("Deleted successfully");
            this.getEmpDeptMapping();
          }
          else {
            this.toastr.error(response.message, 'Error');
          }
        },
        error: () => {
          this.toastr.error('Failed to Delete', 'Error');
        }
        
        });
        }


      
       //PAGINATION STOP
       Paginationrecord() {          
          const startIndex = (this.currentPage - 1) * this.itemsPerPage;
          const endIndex = startIndex + this.itemsPerPage;
          this.paginatedList = this.lstempdeptmapping.slice(startIndex, endIndex);
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

