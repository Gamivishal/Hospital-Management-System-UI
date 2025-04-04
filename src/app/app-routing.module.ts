import { NgModule } from '@angular/core';
import { Routes, RouterModule} from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { GuestComponent } from './theme/layout/guest/guest.component';
import { BaseService } from './services/base.service';
const routes: Routes = [
  {
    path: '',
    component: GuestComponent,
    children: [
      {
        path: '',
        redirectTo: 'auth/signin',
        pathMatch: 'full'
      },
      {
        path: 'auth',
        loadChildren: () => import('./demo/pages/authentication/authentication.module').then((m) => m.AuthenticationModule)
      }
    ]
  },
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./demo/dashboard/dashboard.component').then((c) => c.DashboardComponent)
      },
      {
        path: 'medicinetype',
        loadComponent: () => import('./demo/medicinetype/medicinetype.component').then((c) => c.MedicineTypeComponent)
      },
      {
        path: 'shift',
        loadComponent: () => import('./demo/shift/shift.component').then((c) => c.shiftComponent)
      },
      {
        path: 'roomtype',
        loadComponent: () => import('./demo/roomtype/roomtype.component').then((c) => c.RoomTypesComponent)
      },

      {
        path: 'hospitaltype',
       loadComponent : () => import('./demo/hospitaltype/hospitaltype.component').then((c) => c.hospitaltypeComponent)
      },

      {
        path: 'roles',
        loadComponent : () => import('./demo/Roles/Roles.component').then((c) => c.RolesComponent)
      },
      {
        path: 'hospitaldepartment',
       loadComponent : () => import('./demo/hospitaldepartment/hospitaldepartment.component').then((c) => c.hospitaldepartmentComponent)
      },
      {
        path: 'hospitaldepartment',
       loadComponent : () => import('./demo/hospitaldepartment/hospitaldepartment.component').then((c) => c.hospitaldepartmentComponent)
      },
      {
        path: 'basic',
        loadChildren: () => import('./demo/ui-elements/ui-basic/ui-basic.module').then((m) => m.UiBasicModule)
      },
      
      {
        path: 'forms',
        loadChildren: () => import('./demo/pages/form-elements/form-elements.module').then((m) => m.FormElementsModule)
      },
      {
        path: 'tables',
        loadChildren: () => import('./demo/pages/tables/tables.module').then((m) => m.TablesModule)
      },
      {
        path: 'apexchart',
        loadComponent: () => import('./demo/pages/core-chart/apex-chart/apex-chart.component')
      },
      {
        path: 'sample-page',
        loadComponent: () => import('./demo/extra/sample-page/sample-page.component')
      },
    ]
  },
  
  {
    path: '**',
    redirectTo: 'auth/signin' 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes),HttpClientModule],
  exports: [RouterModule],
  providers: [BaseService]
})
export class AppRoutingModule {}
