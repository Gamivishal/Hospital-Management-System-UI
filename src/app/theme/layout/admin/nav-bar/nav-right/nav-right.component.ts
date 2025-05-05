// angular import
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

// bootstrap import
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { PopUpComponent } from 'src/app/Common/pop-up/pop-up.component';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-nav-right',
  imports: [SharedModule,PopUpComponent],
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss'],
  providers: [NgbDropdownConfig]
})
export class NavRightComponent {
  ;
  userName: string = '';
  private router = inject(Router);
  // public props


  showLogoutPopup = false;
  // constructor
  constructor() {
    const config = inject(NgbDropdownConfig);

    config.placement = 'bottom-right';

    const userdata = localStorage.getItem('data');
    if(userdata){
      const parsedata = JSON.parse(userdata);
      this.userName = parsedata?.useName || '';
    }

  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/auth/signin']);
  }



  

openLogoutModal() {
  this.showLogoutPopup = true;
}

confirmLogout() {
  this.logout();
  this.cleanupLogoutPopup();
}

cancelLogout() {
  this.cleanupLogoutPopup();
}

private cleanupLogoutPopup() {
  this.showLogoutPopup = false;
}

}
