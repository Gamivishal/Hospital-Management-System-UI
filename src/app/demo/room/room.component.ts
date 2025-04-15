/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component,OnInit } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { BaseService } from 'src/app/services/base.service';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AppConstant } from 'src/app/demo/baseservice/baseservice.service';

import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-room',
  standalone: true,
  imports: [SharedModule],
  templateUrl:'./room.component.html',
  styleUrls: ['./room.component.scss']
})
export  class roomsComponent implements OnInit {
  lstroom: any [] = [];
  paginatedList: any[] = [];
  isShowList:boolean=true;
  selectedroomId: number | null = null;

  constructor(private baseService: BaseService,
    private toastr: ToastrService) {}

     ngOnInit() {
      this.createFormGroup();
      this.getroom();

     }

     roomfmGroup:FormGroup;

     // Page NAvigation
     currentPage: number = 1; //currect page number
     itemsPerPage: number =AppConstant.RecordPerPage;  //total data in page
     totalPages: number = 0; //total page
     pageNumbers: number[] = [];//list
     URL=AppConstant.url




     createFormGroup()
     {
      this.roomfmGroup = new FormGroup({
        roomId: new FormControl(0, [Validators.required]),
        room: new FormControl(null, [Validators.required,Validators.minLength(3)]),
      })
     }



     checkRequired(controlName:any)
    {
     return this.roomfmGroup.controls[controlName].touched && this.roomfmGroup.controls[controlName].errors?.['required'];
    }


    checkminlength(controlName:any)
    {
       return this.roomfmGroup.controls[controlName].touched && this.roomfmGroup.controls[controlName].errors?.['minlength']
    }


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






     getroom(){
       this.baseService.GET<any>(this.URL+"Tblroom/GetAll").subscribe(response=>{
       console.log("GET Response:", response);
       this.lstroom = response.data;
       this.totalPages = Math.ceil(this.lstroom.length / this.itemsPerPage);
       this. Paginationrecord();
       this.PageNumber();
       });
      }

      Addroom()
      {
       this.baseService.POST(this.URL+"Tblroom/Add", this.roomfmGroup.getRawValue())
       .subscribe({
        next: (response:any) => {
        if (response.statusCode === 200) {
        this.toastr.success(response.message, 'Success');
        console.log("POST Response:", response);
        this.getroom(); // Refresh list
        this.isShowList = true;

        this.roomfmGroup.reset({
          roomId: 0,
          room: ''
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


      editRoom(room: any) {
        this.selectedroomId = room.roomId;
        this.isShowList = false;
        this.roomfmGroup.patchValue({
            roomId: room.roomId,
            room: room.room
        });
    }


      updateRoom() {
        this.baseService.PUT(this.URL+"Tblroom/Update", this.roomfmGroup.getRawValue())
          .subscribe({
            next: (response: any) => {
              if (response.statusCode === 200) {
                this.toastr.success(response.message, 'Success');
            console.log("PUT Response:", response);
            this.getroom();
            this.isShowList = true;
            this.currentPage = 1;
          } else {
            this.toastr.error(response.message, 'Error');
          }
        },
        error: () => {
          this.toastr.error('Failed to update ', 'Error');
        }
      });
      }


    //   onDelete(hospitalTypeID: number){
    //     this.baseService.DELETE(this.URL+"TblHospitalType/Delete?id=" + hospitalTypeID).subscribe({
    //       next: (response: any) => {
    //         if (response.statusCode === 200) {
    //           this.toastr.success(response.message, 'Success');
    //       console.log("DELETE Response:", response);
    //       this.gethospitaltypelist();
    //       this.isShowList = true;
    //     } else {
    //       this.toastr.error(response.message, 'Error');
    //     }
    //   },
    //   error: () => {
    //     this.toastr.error('Failed to delete ', 'Error');
    //   }
    // });
    //   }


      onDelete(roomId: number){
        this.baseService.DELETE(URL+"Tblroom/delete?id=" +roomId).subscribe({
          next: (response: any) => {
            if (response.statusCode === 200) {
              this.toastr.success(response.message, 'Success');
          console.log("DELETE Response:", response);
          this.getroom();
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
