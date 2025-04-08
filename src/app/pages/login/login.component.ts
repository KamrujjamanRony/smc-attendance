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
      this.loginSubscription = this.LoginService.login(this.form.value)
        .subscribe({
          next: (response: any) => {
            this.authService.setUser(response);
            this.toastService.showMessage('success', 'Successful', 'User Login Successfully!');
            this.router.navigate(['/home']);
          },
          error: (error) => {
            console.error('Error login user:', error);
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
