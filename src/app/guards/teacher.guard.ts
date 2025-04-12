import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const teacherGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const user = authService.getUser();
  if (user && (user.type === 'admin' || user.type === 'teacher')) {
    return true;
  } else {
    return false;
  }
};
