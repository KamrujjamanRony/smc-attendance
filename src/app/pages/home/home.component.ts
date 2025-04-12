import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ToastService } from '../../components/primeng/toast/toast.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastService = inject(ToastService);
  title = 'Attendance Management System';
  description = 'An efficient way to manage attendance.';
  user: any = null;
  constructor() { }

  ngOnInit() {
    this.user = this.authService.getUser();
  }

  goToAttendance() {
    if (this.user && (this.user.type === 'admin' || this.user.type === 'teacher')) {
      this.router.navigate(['/attendance-category']);
      return;
    } else {
      this.toastService.showMessage('warn', 'Access Denied!', 'You are not authorized to access this page.');
    }
  }

}
