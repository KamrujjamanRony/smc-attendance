import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  menuItems = [
    { label: 'Home', path: '' },
    { label: 'Login', path: 'login' },
    { label: 'Subject Selection', path: 'subject-selection' },
    { label: 'Attendance Category', path: 'attendance-category' },
    { label: 'Meeting', path: 'meeting' },
    { label: 'Student List', path: 'student-list' },
    { label: 'Subject List', path: 'subject-list' },
    { label: 'Meeting List', path: 'meeting-list' },
    { label: 'About', path: 'about' },
    { label: 'Contact', path: 'contact' }
  ];
  isCollapsed = false;
  toggleMenu() {
    this.isCollapsed = !this.isCollapsed;
  }
  closeMenu() {
    this.isCollapsed = false;
  }

}
