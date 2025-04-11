import { Injectable } from '@angular/core';
import { ToastrService, ToastrModule } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

//   constructor(private toastr: ToastrService) {}

//   // 🔹 Success Notification
//   showSuccess(message: string, title: string = 'Success') {
//     this.toastr.success(message, title, { timeOut: 3000 });
//   }

//   // 🔹 Error Notification
//   showError(message: string, title: string = 'Error') {
//     this.toastr.error(message, title, { timeOut: 5000 });
//   }

//   // 🔹 Handle API Response (Status-Based Toastr)
//   handleApiResponse(statusCode: number, message: string) {
//     if (statusCode === 200) {
//       this.showSuccess(message);
//     } else if (statusCode === 400) {
//       this.showError(message);
//     } else {
//       this.toastr.info('Something happened', 'Info');
//     }
//   }
}

