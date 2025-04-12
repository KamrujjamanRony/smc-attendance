import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const stuffGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const user = authService.getUser();
  if (user && (user.type === 'admin' || user.type === 'stuff')) {
    return true;
  } else {
    return false;
  }
};
