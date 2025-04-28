import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'signin',
        loadComponent: () => import('./auth-signin/auth-signin.component')
      },
      {
        path: 'signup',
        loadComponent: () => import('./auth-signup/auth-signup.component').then(m => m.SignupComponent)
      },
      {
        path: 'forget-password',
        loadComponent: () => import('./forget-password/forget-password.component')
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule {}
