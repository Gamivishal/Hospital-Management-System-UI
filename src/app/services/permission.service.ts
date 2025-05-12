// // src/app/services/permission.service.ts

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  [x: string]: any;
  // Stores permissions per module
  private permissionsMap: { [moduleName: string]: any } = {};

  constructor() {}

  // Set permissions for a specific module
  setModulePermissions(moduleName: string, permissionData: any) {
    this.permissionsMap[moduleName] = permissionData;
  }

  // Get permissions for a specific module
  getPermission(moduleName: string): any {
    return this.permissionsMap[moduleName] || {
      isAdd: false,
      isEdit: false,
      isDelete: false,
      isView: false
    };
  }
  getPermissions(moduleName: string): { isAdd: boolean; isEdit: boolean; isDelete: boolean; isView: boolean } {
    const permissionData = JSON.parse(localStorage.getItem('MenuPermission') || '[]');
  
    const modulePermission = permissionData.find((item: any) => item.menuName === moduleName);
  
    if (modulePermission) {
      return {
        isAdd: modulePermission.isAdd,
        isEdit: modulePermission.isEdit,
        isDelete: modulePermission.isDelete,
        isView: modulePermission.isView
      };
    }
  
    return {
      isAdd: false,
      isEdit: false,
      isDelete: false,
      isView: false
    };
  }
  
  
  

  // Direct helper methods if needed
  hasPermission(moduleName: string, action: 'add' | 'edit' | 'delete' | 'view'): boolean
   {
    const perm = this.getPermission(moduleName);
    switch (action) {
      case 'add': return perm.isAdd;
      case 'edit': return perm.isEdit;
      case 'delete': return perm.isDelete;
      case 'view': return perm.isView;
      default: return false;
    }
  }
}

