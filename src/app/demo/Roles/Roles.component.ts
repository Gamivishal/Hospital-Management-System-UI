
import { Component,inject,OnInit } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { BaseService } from 'src/app/services/base.service';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-Role',
  standalone: true,
  imports: [CommonModule,SharedModule],
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class rolesComponent implements OnInit {
  objroles:any[]=[];
  Roles: any[] = [];
 isShowList:boolean=true;

 selectedroleId: number | null = null;
  // Addroles: any;

  // roletypepost : any ={
  //   "createBy": 0,
  //   "createdOn": "",
  //   "updateBy": 0,
  //   "updateOn": "",
  //   "isActive": true,
  //   "versionNo": 0,
  //   "roleId": 0,
  //   "rolename": ""
  //  }
   http=inject(HttpClient)
  constructor(private baseService: BaseService) {}
 
    // life cycle event
    ngOnInit() {
      this.createFormGroup();
      this.getRoles();
      this.AddRoles();
    }
    rolesfmGroup:FormGroup;
    //Paginantion Properties 
    currentPage: number = 1; //currect page number
    itemsPerPage: number = 7; //total data in page
    totalPages: number = 0; //total page
    pageNumbers: number[] = [];//list

    createFormGroup()
    {
     this.rolesfmGroup = new FormGroup({
      RoleId: new FormControl(0, [Validators.required]),
      Rolename: new FormControl(null, [Validators.required,Validators.minLength(4)]),
      
     })
    }

    checkRequired(controlName:any)
    {
      return this.rolesfmGroup.controls[controlName].errors['required'];
    }


    checkminlength(controlName:any)
    {
       return this.rolesfmGroup.controls[controlName].errors['minlength']!=null;
    }


    getRoles()
    {
      this.baseService.GET<any>("https://localhost:7272/api/TblRole/GetAll").subscribe(response=>{
        console.log("GET Response:", response);
        this.objroles = response.data;
        this.totalPages = Math.ceil(this.objroles.length / this.itemsPerPage); // FIX: Update total pages
        this.AddRoles();//update list
        this.PageNumber(); // FIX: Update page numbers
      });
    }

    // AddRoles() 
    //   {
    //    this.baseService.POST("https://localhost:7272/api/TblRole/Add", this.rolesfmGroup.getRawValue())
    //    .subscribe(response => {
    //     console.log("POST Response:", response);
    //     this.getRoles(); // Refresh list
    //     this.isShowList = true; 
    //    });
    AddRoles()
      {
        this.baseService.POST("https://localhost:7272/api/TblRole/Add",this.rolesfmGroup.getRawValue())
        .subscribe(response => {
          console.log("POST Response:",response);
          this.getRoles();
          this.isShowList = true;
      });
      
    //record for the page
    this.AddRoles() 
      {
  const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  const endIndex = startIndex + this.itemsPerPage;
  this.Roles = this.objroles.slice(startIndex, endIndex);
    }
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
    this.AddRoles();
  }
}
}	