import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const rawtoken = localStorage.getItem('data');
    // const rawuserId = localStorage.getItem('userId');

    // const token = rawtoken? JSON.parse(rawtoken) : null;
    // const userId = rawuserId? JSON.parse(rawuserId) : 0;
    const parsedata = JSON.parse(rawtoken);
    const data = parsedata.data;
    const userId = parsedata.userId;

    if (data && userId !=0) {

        return true;

    } else {
      this.router.navigate(['/auth/signin']); 
      return false;
    }
  }
}
