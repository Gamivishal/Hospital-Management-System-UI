/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component,inject,OnInit } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { BaseService } from 'src/app/services/base.service';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';



@Component({
  selector: 'app-roomtypeess',
  standalone: true,
  imports: [SharedModule],
  templateUrl:'./roomtype.component.html',
  styleUrls: ['./roomtype.component.scss']
})
export  class RoomTypesComponent implements OnInit {
  lstroomtype: any [] = [];
  paginatedList: any[] = [];
  isShowList:boolean=true;
  selectedRoomTypeId: number | null = null;
//   roomtypepost : any ={
//       "createBy": 0,
//       "createdOn": "",
//       "updateBy": 0,
//       "updateOn": "",
//       "isActive": true,
//       "versionNo": 0,
//       "roomTypeId": 0,
//       "roomType": ""
//  }
//  lstroomtype: any
  // http=inject(HttpClient)

  // roomTypeId: number = null;

  constructor(private baseService: BaseService) {}

     ngOnInit() {
      this.createFormGroup();
      this.getRoomType();
      this.AddRoomType()
    
     }

     roomTypefmGroup:FormGroup;

     // Page NAvigation 
     currentPage: number = 1; //currect page number
     itemsPerPage: number = 5; //total data in page
     totalPages: number = 0; //total page
     pageNumbers: number[] = [];//list




     createFormGroup()
     {
      this.roomTypefmGroup = new FormGroup({
        roomTypeId: new FormControl(0, [Validators.required]),
        roomType: new FormControl(null, [Validators.required,Validators.minLength(3)]),
      })
     }
     


     checkRequired(controlName:any)
    {
     return this.roomTypefmGroup.controls[controlName].errors?.['required'];
    }


    checkminlength(controlName:any)
    {
       return this.roomTypefmGroup.controls[controlName].errors?.['minlength']
    }


    Paginationrecord() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      this.paginatedList = this.lstroomtype.slice(startIndex, endIndex);
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


 



     getRoomType(){
       this.baseService.GET<any>("https://localhost:7272/api/TblRoomType/GetAll").subscribe(response=>{
       console.log("GET Response:", response);
       this.lstroomtype = response.data;
       this.totalPages = Math.ceil(this.lstroomtype.length / this.itemsPerPage); // FIX: Update total pages
       this. Paginationrecord();//update list
       this.PageNumber(); // FIX: Update page numbers
       });
      }

      AddRoomType() 
      {
       this.baseService.POST("https://localhost:7272/api/TblRoomType/Add", this.roomTypefmGroup.getRawValue())
       .subscribe(response => {
        console.log("POST Response:", response);
        this.getRoomType(); // Refresh list

        this.roomTypefmGroup.reset({
          roomTypeId: 0, 
          roomType: ''
        });
        this.isShowList = true;
       });
      } 


   
      editRoom(room: any) {
        this.selectedRoomTypeId = room.roomTypeId;
        this.isShowList = false; // Show edit form
        this.roomTypefmGroup.patchValue({
            roomTypeId: room.roomTypeId, // Correct key
            roomType: room.roomType // Correct key
        });
    }
    

      updateRoom() {
        this.baseService.PUT("https://localhost:7272/api/TblRoomType/Update", this.roomTypefmGroup.getRawValue())
          .subscribe(response => {
            console.log("PUT Response:", response);
            this.getRoomType();
            this.isShowList = true;
            this.currentPage = 1; 
          });
      }
    
      
      onDelete(roomId: number){
        this.baseService.DELETE("https://localhost:7272/api/TblRoomType/delete?id=" + roomId).subscribe(response => {
          // this.baseService.DELETE("https://localhost:7272/api/TblRoomType/delete?id=" + roomId).subscribe(response => {
  
        console.log("DELETE Response:", response);
          this.getRoomType();
          this.isShowList = true;
        });
      }


      // getbyId(id: number) {
      //   this.baseService.GET<any>(`https://localhost:7272/api/TblRoomType/GetById?id=${id}`)
      //     .subscribe(
      //       response => {
      //         console.log("GET BY ID Response:", response);
      //       });
      // }
}
