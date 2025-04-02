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
    this.isShowList = false;
    this.rolesfmGroup.patchValue({
      roleId: role.roleId,
      rolename: role.roleName
    });
  }

  updateRole() {


    this.baseService.PUT("https://localhost:7272/api/TblRole/Update",this.rolesfmGroup.getRawValue()) // No ID in the URL
      .subscribe({
        next: response => {
          console.log("PUT Response:", response);
          this.getRoles();
          this.isShowList = true;
          },

      });
  }
  
  onDelete(roleId: number) {
    // console.log(roleId);
    this.baseService.DELETE("https://localhost:7272/api/TblRole/delete?id=" + roleId).subscribe(response => {
      console.log("DELETE Response:", response);
      this.getRoles();
      this.isShowList = true;
    });
  }
}