import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../components/primeng/toast/toast.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-admin-form',
  imports: [FormsModule, CommonModule],
  templateUrl: './admin-form.component.html',
  styleUrl: './admin-form.component.css'
})
export class AdminFormComponent {
  private LoginService = inject(LoginService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  route = inject(ActivatedRoute);
  id: any = null;
  model?: any;
  paramsSubscription?: Subscription;
  LoginSubscription?: Subscription;
  loading = signal<boolean>(false);

  constructor() {
    this.onReset();
  }

  ngOnInit(): void {
    this.paramsSubscription = this.route.paramMap.subscribe({
      next: (params) => {
        this.id = params.get('id');
        if (this.id) {
          this.LoginService.getLogin(this.id, "")
            .subscribe({
              next: (response) => {
                if (response) {
                  this.model = response[0];
                }
              }
            });
        }
      }
    });
  }

  onFormSubmit(): void {
    const { userName, password, type } = this.model;
    this.loading.set(true);
    if (userName && password && type) {

      if (this.id) {
        this.LoginSubscription = this.LoginService.updateLogin(this.id, this.model)
          .subscribe({
            next: (response) => {
              this.toastService.showMessage('success', 'Success', 'Admin Update successfully');
              this.onReset();
              this.id = null;
              this.loading.set(false);
              this.router.navigateByUrl('/admin-list');
            },
            error: (error) => {
              this.toastService.showMessage('error', 'Error', `Error Update Admin: ${error.error.message || error.error.title}`);
              console.error('Error Update Admin:', error.error);
              this.loading.set(false);
            }
          });
      } else {
        this.LoginSubscription = this.LoginService.addLogin(this.model)
          .subscribe({
            next: (response) => {
              this.toastService.showMessage('success', 'Success', 'Admin Add successfully');
              this.onReset();
              this.loading.set(false);
              this.router.navigateByUrl('/admin-list');
            },
            error: (error) => {
              this.toastService.showMessage('error', 'Error', `Error Add Admin: ${error.error.message || error.error.title}`);
              console.error('Error Add Admin:', error.error);
              this.loading.set(false);
            }
          });
      }
    } else {
      this.toastService.showMessage('warn', 'Warning', 'Form is invalid! Please Fill All Required Field!');
      this.loading.set(false);
    }
  };

  onReset() {
    this.model = {
      userName: "",
      password: "",
      type: "",
    };
  }

  ngOnDestroy(): void {
    this.paramsSubscription?.unsubscribe();
    this.LoginSubscription?.unsubscribe();
  }

}
