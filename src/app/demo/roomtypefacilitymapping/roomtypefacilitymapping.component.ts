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
  templateUrl:'./roomtypefacilitymapping.component.html',
  styleUrls: ['./roomtypefacilitymapping.component.scss']
})
export  class roomtypefacilitymapping implements OnInit {
  lstroomtypefacilitymapping: any [] = [];
  paginatedList: any[] = [];
  isShowList:boolean=true;
  lstRoomName: any[] = [];
  lstFacilityName: any[] = [];
  roomfacID: number | null = null;
  facility: any;


   constructor(private baseService: BaseService,
      private toastr: ToastrService) {}

     ngOnInit() {
      this.createFormGroup();
      this.getroomname();
      this.getfacilityname();
      this.getroomtypefacilitymapping();
    
     }

     roomtypefacilitymappingfmGroup:FormGroup;

     // Page NAvigation 
     currentPage: number = 1; //currect page number
     itemsPerPage: number = 5; //total data in page
     totalPages: number = 0; //total page
     pageNumbers: number[] = [];//list
     URL=AppConstant.url

     createFormGroup() {
      
      this.roomtypefacilitymappingfmGroup = new FormGroup({
        roomtypefacilitymappingid: new FormControl(0),
        roomID: new FormControl(null, Validators.required),
        facilityID: new FormControl(null, Validators.required), 
        
      });

    }
     


     checkRequired(controlName:any)
    {
     return this.roomtypefacilitymappingfmGroup.controls[controlName].errors?.['required'];
    }


    checkminlength(controlName:any)
    {
       return this.roomtypefacilitymappingfmGroup.controls[controlName].errors?.['minlength']
    }



  
    //get roomname
    
    getroomname() {
      this.baseService.GET<any>(this.URL+"GetDropDownList/FillRoomtype")
        .subscribe(response => {
          console.log("Room Name:", response);
          this.lstRoomName = response.data;
        });
    }

    //get facilityname

    getfacilityname() {
      this.baseService.GET<any>(this.URL+"GetDropDownList/FillFacilityName")
        .subscribe(response => {
          console.log("Facility Name:", response);
          this.lstFacilityName = response.data;
        });
    }


    //get roomtypefacilitymapping


    getroomtypefacilitymapping(){
      this.baseService.GET<any>(this.URL+"TblRoomTypeFacilityMapping/GetAll").subscribe(response =>{
        console.log("GET Response:", response);
        this.lstroomtypefacilitymapping = response.data;
        this.totalPages = Math.ceil(this.lstroomtypefacilitymapping.length / this.itemsPerPage);
        this.Paginationrecord();
        this.PageNumber();
      });
    }


    //add roomtypefacilitymapping

    Addroomtypefacilitymapping() {
      console.log(this.roomtypefacilitymappingfmGroup.getRawValue())
      this.baseService.POST(this.URL + "TblRoomTypeFacilityMapping/Add", this.roomtypefacilitymappingfmGroup.getRawValue())
        .subscribe({next: (response:any) => {
          if (response.statusCode === 200) {
            this.toastr.success(response.message, 'Success');
            this.getroomtypefacilitymapping();
            this.Paginationrecord(); 
            this.isShowList = true;
            this.roomtypefacilitymappingfmGroup.reset();
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

    

      //edit roomtypefacilitymapping
   
      editroomtypefacilitymapping(item: any) {  
        this.roomfacID = item.roomTypeFacilityMappingID;
        this.isShowList = false;
        this.roomtypefacilitymappingfmGroup.patchValue({
          roomtypefacilitymappingid: item.roomTypeFacilityMappingID,
          roomID: item.roomID,
          facilityID: item.facilityID
        });
      }
      
      //update roomtypefacilitymapping
    
    updateroomtypefacilitymapping() {
      this.baseService.PUT(this.URL + "TblRoomTypeFacilityMapping/Update", this.roomtypefacilitymappingfmGroup.getRawValue())
        .subscribe({next: (response:any) => {
          if (response.statusCode === 200) {
            this.toastr.success(response.message, 'Success');
          console.log("PUT Response", response)
            this.getroomtypefacilitymapping();
            this.isShowList = true;
            this.roomfacID = null;
            this.roomtypefacilitymappingfmGroup.reset();
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
      
      

      //delete roomtypefacilitymapping
      onDelete(id: number) {
        this.baseService.DELETE(this.URL + "TblRoomTypeFacilityMapping/Delete?id=" + id)
          .subscribe(response => {
            this.toastr.success("Deleted successfully");
            this.getroomtypefacilitymapping();
          });
      }


      
       //PAGINATION STOP
       Paginationrecord() {          
          const startIndex = (this.currentPage - 1) * this.itemsPerPage;
          const endIndex = startIndex + this.itemsPerPage;
          this.paginatedList = this.lstroomtypefacilitymapping.slice(startIndex, endIndex);
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

