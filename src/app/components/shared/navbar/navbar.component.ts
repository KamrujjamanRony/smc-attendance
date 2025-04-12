import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  menuItems = [
    { label: 'Home', path: '' },
    { label: 'Subject List', path: 'subject-list' },
    { label: 'Student List', path: 'student-list' },
    { label: 'Subject Selection List', path: 'subject-selection' },
    { label: 'Attendance Category', path: 'attendance-category' },
    { label: 'Attendance Details', path: 'attendance-details' },
    { label: 'Meeting', path: 'meeting' },
    { label: 'Meeting List', path: 'meeting-list' }
  ];
  isCollapsed = false;
  user: any = null;


  ngOnInit() {
    this.user = this.authService.getUser();
    if (this.user && this.user.type === 'admin') {
      this.menuItems.push({ label: 'Admin List', path: `admin-list` });
    }
  }
  toggleMenu() {
    this.isCollapsed = !this.isCollapsed;
  }
  closeMenu() {
    this.isCollapsed = false;
  }
  logOut() {
    this.authService.deleteUser();
    this.router.navigateByUrl('/login');
  }

}
