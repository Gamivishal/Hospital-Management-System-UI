import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { BaseService } from 'src/app/services/base.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-Role',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {
  lstrole: any[] = [];
  Roles: any[] = [];
  isShowList: boolean = true;
  selectedroleId: number | null = null;
  rolesfmGroup: FormGroup;

  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 0;
  pageNumbers: number[] = [];

  roleData :any
  constructor(private baseService: BaseService) {}

  ngOnInit() {
    this.createFormGroup();
    this.getRoles();
  }

  createFormGroup() {
    this.rolesfmGroup = new FormGroup({
      roleId: new FormControl(0, [Validators.required]),
      rolename: new FormControl(null, [Validators.required, Validators.minLength(3)]),
    });
  }

  checkRequired(controlName: any) {
    return this.rolesfmGroup.controls[controlName].errors?.['required'];
  }

  // Pagination logic
  Rolerecord() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.Roles = this.lstrole.slice(startIndex, endIndex);
  }

  PageNumber() {
    this.pageNumbers = [];
    for (let i = 1; i <= Math.min(this.totalPages, 3); i++) {
      this.pageNumbers.push(i);
    }
  }

  nextpage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.Rolerecord();
    }
  }

  getRoles() {
    this.baseService.GET<any>("https://localhost:7272/api/TblRole/GetAll").subscribe(response => {
      this.lstrole = response.data;
      this.totalPages = Math.ceil(this.lstrole.length / this.itemsPerPage);
      this.Rolerecord();
      this.PageNumber();
    });
  }

  AddRoles() {
    this.baseService.POST("https://localhost:7272/api/TblRole/Add", this.rolesfmGroup.getRawValue())
      .subscribe(response => {
        this.getRoles();
        this.isShowList = true;
      });
  }

  editRole(role: any) {
    this.selectedroleId = role.roleId;

    this.baseService.GET("https://localhost:7272/api/TblRole/GetById?id=" + role.roleId)
      .subscribe((response: { data: string }) => {
        console.log(response);
        this.isShowList = false;
        this.roleData = response;
        this.rolesfmGroup.patchValue({
          roleId: role.roleId,
          rolename: response.data // Extract the 'data' property
        });
      });
  }

  updateRole(): void { 
    if(this.rolesfmGroup.invalid) {
      console.log("Form is invalid"); 
      return;
    }
    let requstdata = {
      roleId: this.rolesfmGroup.get('roleId')?.value,
      rolename: this.rolesfmGroup.get('rolename')?.value 
    };
      this.baseService.PATCH("https://localhost:7272/api/TblRole/Update", requstdata)
        .subscribe(response => {
          console.log("PUT Response:", response);
          this.getRoles();
          this.isShowList = true;
          this.selectedroleId = null; 
        });
  }
  
  onDelete(roleId: number) {
    // console.log(roleId);
    this.baseService.DELETE(`https://localhost:7272/api/TblRole/delete?id=${roleId}`).subscribe(response => {
      this.getRoles();
      this.isShowList = true;
    });
  }
}