import { Component, inject, signal } from '@angular/core';
import { ToastService } from '../../components/primeng/toast/toast.service';
import { LoginService } from '../../services/login.service';
import { CoverComponent } from "../../components/shared/cover/cover.component";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-list',
  imports: [CoverComponent, RouterLink],
  templateUrl: './admin-list.component.html',
  styleUrl: './admin-list.component.css'
})
export class AdminListComponent {
  private LoginService = inject(LoginService);
  private toastService = inject(ToastService);

  filterLogin = signal<any>([]);
  loading = signal<boolean>(false);

  ngOnInit(): void {
    this.loading.set(true);
    this.LoginService.getLogin("", "").subscribe(data => {
      this.filterLogin.set(data);
      this.loading.set(false);
    });
  }
  onDelete(id: any) {
    if (confirm("Are you sure you want to delete?")) {
      this.LoginService.deleteLogin(id).subscribe(data => {
        if (data.id) {
          this.toastService.showMessage('success', 'Success', 'Admin deleted successfully!');
          this.filterLogin.set(this.filterLogin().filter((a: any) => a.id !== data.id));
        } else {
          console.error('Error deleting Admin:', data);
          this.toastService.showMessage('error', 'Error', `Error deleting Admin: ${data.message || data.error.message}`);
        }
      });
    };
  }

}
