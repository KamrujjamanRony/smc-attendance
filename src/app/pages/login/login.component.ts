import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { LoginService } from '../../services/login.service';
import { ToastService } from '../../components/primeng/toast/toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],

  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private router = inject(Router);
  private authService = inject(AuthService);
  private LoginService = inject(LoginService);
  private toastService = inject(ToastService);
  private loginSubscription?: Subscription;
  fb = inject(NonNullableFormBuilder);
  isSubmitted = false;
  isLoading = signal(false);

  form = this.fb.group({
    userName: ['', [Validators.required]],
    password: ['', Validators.required],
  });

  // Simplified method to get form controls
  getControl(controlName: string): FormControl {
    return this.form.get(controlName) as FormControl;
  }

  ngOnInit() { };

  onSubmit(): void {
    this.isSubmitted = true;
    if (this.form.valid) {
      this.isLoading.set(true);
      this.loginSubscription = this.LoginService.login(this.form.value)
        .subscribe({
          next: (response: any) => {
            if (response.length === 0) {
              this.toastService.showMessage('error', 'Error', 'Invalid UserName Or Password!');
              this.isLoading.set(false);
              return;
            }
            this.authService.setUser(response[0]);
            this.toastService.showMessage('success', 'Successful', 'User Login Successfully!');
            this.router.navigate(['/home']);
            this.isLoading.set(false);
          },
          error: (error) => {
            console.error('Error login user:', error);
            this.isLoading.set(false);
            if (error.error.message || error.error.title) {
              this.toastService.showMessage('error', 'Error', `${error.error.status} : ${error.error.message || error.error.title}`);
            }
          }
        });
      this.isSubmitted = true;
    } else {
      this.toastService.showMessage('warn', 'Warning', 'Form is invalid! Please Fill All Recommended Field!');
    }
  };

  ngOnDestroy(): void {
    this.loginSubscription?.unsubscribe();
  }

}
