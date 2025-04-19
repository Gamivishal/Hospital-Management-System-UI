// angular import
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

// bootstrap import
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-nav-right',
  imports: [SharedModule],
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss'],
  providers: [NgbDropdownConfig]
})
export class NavRightComponent {
  ;
  userName: string = '';
  private router = inject(Router);
  // public props

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
    localStorage.removeItem('data');
    this.router.navigate(['/auth/signin']);
  }
}
