import { NgModule } from '@angular/core';
import { Routes, RouterModule} from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { GuestComponent } from './theme/layout/guest/guest.component';
import { BaseService } from './services/base.service';
import { AuthGuard } from './auth.guard';
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
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./demo/dashboard/dashboard.component').then((c) => c.DashboardComponent),
        canActivate: [AuthGuard]

      },
      {
        path: 'medicinetype',
        loadComponent: () => import('./demo/medicinetype/medicinetype.component').then((c) => c.MedicineTypeComponent),
        canActivate: [AuthGuard]

      },
      {
        path: 'shift',
        loadComponent: () => import('./demo/shift/shift.component').then((c) => c.shiftComponent),
        canActivate: [AuthGuard]

      },
      {
        path: 'roomtype',
        loadComponent: () => import('./demo/roomtype/roomtype.component').then((c) => c.RoomTypesComponent),
        canActivate: [AuthGuard]

      },

      {
        path: 'hospitaltype',
       loadComponent : () => import('./demo/hospitaltype/hospitaltype.component').then((c) => c.hospitaltypeComponent),
       canActivate: [AuthGuard]

      },
      {
        path: 'billing',
        loadComponent : () => import ('./demo/billing/billing.component').then((c) => c.billingComponent)
      },
      {
        path: 'roles',
        loadComponent : () => import('./demo/Roles/Roles.component').then((c) => c.RolesComponent),
        canActivate: [AuthGuard]

      },
      {
        path: 'hospitaldepartment',
       loadComponent : () => import('./demo/hospitaldepartment/hospitaldepartment.component').then((c) => c.hospitaldepartmentComponent),canActivate: [AuthGuard]
      },
      {
        path: 'patientdata',
       loadComponent : () => import('./demo/patientdata/patientdata.component').then((c) => c.PatientDataComponent),canActivate: [AuthGuard]
      },

      {
        path: 'patientdoctormapping',
        loadComponent: () => import('./demo/patientdoctormapping/patientdoctormapping.component').then((c) => c.patientdoctormappingComponent),canActivate: [AuthGuard]
      },
      {
        path: 'empshiftmapping',
        loadComponent : () => import ('./demo/empshiftmapping/empshiftmapping.component').then((c) => c.empshiftmapping),
        canActivate: [AuthGuard]
      },
      {
        path: 'empdepartmentmapping',
        loadComponent : () => import ('./demo/empdepartmentmapping/empdepartmentmapping.component').then((c) => c.EmpDepartmentMapping),canActivate: [AuthGuard]
      },
      {
        path: 'billing',
       loadComponent : () => import('./demo/billing/billing.component').then((c) => c.billingComponent)
      },
      {
        path: 'diseasetype',
       loadComponent : () => import('./demo/diseasetype/diseasetype.component').then((c) => c.DiseaseTypeComponent)
      },
      {
        path: 'medicinedetails',
       loadComponent : () => import('./demo/medicinedetails/medicinedetails.component').then((c) => c. medicinedetails)
      },
      {
        path: 'medicinedetails/:id',
       loadComponent : () => import('./demo/medicinedetails/medicinedetails.component').then((c) => c. medicinedetails)
      },
      {
        path: 'treatmentdetails',
       loadComponent : () => import('./demo/treatmentdetails/treatmentdetails.component').then((c) => c. TreatmentdetailsComponent)
      },
      {
        path: 'basic',
        loadChildren: () => import('./demo/ui-elements/ui-basic/ui-basic.module').then((m) => m.UiBasicModule),
        canActivate: [AuthGuard]
      },


      {
        path: 'forms',
        loadChildren: () => import('./demo/pages/form-elements/form-elements.module').then((m) => m.FormElementsModule),canActivate: [AuthGuard]
      },
      {
        path: 'tables',
        loadChildren: () => import('./demo/pages/tables/tables.module').then((m) => m.TablesModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'apexchart',
        loadComponent: () => import('./demo/pages/core-chart/apex-chart/apex-chart.component'),
        canActivate: [AuthGuard]
      },
      {
        path: 'sample-page',
        loadComponent: () => import('./demo/extra/sample-page/sample-page.component'),
        canActivate: [AuthGuard]
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
