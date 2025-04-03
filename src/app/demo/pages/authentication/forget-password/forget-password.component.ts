import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BaseService } from 'src/app/services/base.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [RouterModule, FormsModule], // Added FormsModule for ngModel support
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export default class ForgetPasswordComponent {
  email: string = '';  // Added property for user email

  constructor(private baseService: BaseService, private toastr: ToastrService) {}

  changePassword() {
    if (!this.email) {
      this.toastr.warning("Please enter your email.");
      return;
    }

    this.baseService.POST("https://localhost:7272/api/TblUser/ForgetPassword", { email: this.email })
      .subscribe({
        next: (response) => {
          this.toastr.success("Password reset successfully. Check your email!");
          console.log("Password Reset Response:", response);
        },
        error: (err) => {
          this.toastr.error("Error resetting password. Please try again.");
          console.error("Error:", err);
        }
      });
  }
}
