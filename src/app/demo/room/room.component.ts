/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @angular-eslint/component-class-suffix */
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
  templateUrl:'./room.component.html',
  styleUrls: ['./room.component.scss']
})
export  class roomsComponent implements OnInit {
  lstroom: any [] = [];
  paginatedList: any[] = [];
  isShowList:boolean=true;
  lstRoomName: any[] = [];
  lstFacilityName: any[] = [];
  room: number | null = null;
  facility: any;
  roomfmGroup:FormGroup;

     // Page NAvigation
     currentPage: number = 1; //currect page number
     itemsPerPage: number = 5; //total data in page
     totalPages: number = 0; //total page
     pageNumbers: number[] = [];//list
     URL=AppConstant.url


   constructor(private baseService: BaseService,
      private toastr: ToastrService) {}

     ngOnInit() {
      this.createFormGroup();
      this.getroom();
      //this.getroom();

     }
     resetForm(){
      this.isShowList = false;
      this.createFormGroup();
      this.room = null;
    }
  

     

     createFormGroup() {

      this.roomfmGroup = new FormGroup({
       // roomtypefacilitymappingid: new FormControl(0),
        roomID: new FormControl(null, Validators.required),
        room: new FormControl(null, Validators.required),

      });

    }



     checkRequired(controlName:any)
    {
     return this.roomfmGroup.controls[controlName].errors?.['required'];
    }


    checkminlength(controlName:any)
    {
       return this.roomfmGroup.controls[controlName].errors?.['minlength']
    }
    //PAGINATION STOP
    Paginationrecord() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      this.paginatedList = this.lstroom.slice(startIndex, endIndex);
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
      




    //get roomname
    getroomname() {
      this.baseService.GET<any>(this.URL + "GetDropDownList/FillRoomtype")
        .subscribe(response => {
          console.log("Room Name Response:", response); // Debugging log
          this.lstRoomName = response.data;
        });
    }
   

    

    //get room


    getroom(){
      
      this.baseService.GET<any>(this.URL+"TblRoom/GetAll").subscribe(response =>{
        console.log("GET Response:", response);
        this.lstroom = response.data;
        this.totalPages = Math.ceil(this.lstroom.length / this.itemsPerPage);
        this.Paginationrecord();
        this.PageNumber();
      });
    }


    //add room

    Addroom() {
      
      // console.log(this.roomtypefacilitymappingfmGroup.getRawValue())
      this.baseService.POST(this.URL + "Tblroom/Add", this.roomfmGroup.getRawValue())
        .subscribe({next: (response:any) => {
          if (response.statusCode === 200) {
            this.toastr.success(response.message, 'Success');
            this.getroom();
            this.Paginationrecord();
            this.isShowList = true;
            this.roomfmGroup.reset();
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



      //edit room

      editRoom(item: any) {
        this.room = item.roomID;
        this.isShowList = false;
        this.roomfmGroup.patchValue({
        roomID: item.roomID,
        facilityID: item.facilityID
        });
      }

      //update room

      updateRoom() {
      this.baseService.PUT(this.URL + "Tblroom/Update", this.roomfmGroup.getRawValue())
        .subscribe({next: (response:any) => {
          if (response.statusCode === 200) {
            this.toastr.success(response.message, 'Success');
          console.log("PUT Response", response)
            this.getroom();
            this.isShowList = true;
            this.room = null;
            this.roomfmGroup.reset();
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



    //delete room
    
      onDelete(roomId: number){
                this.baseService.DELETE(URL+"Tblroom/delete?id=" +roomId).subscribe({
                  next: (response: any) => {
                    if (response.statusCode === 200) {
                      this.toastr.success(response.message, 'Success');
                  console.log("DELETE Response:", response);
                  this.getroomname();
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


       

