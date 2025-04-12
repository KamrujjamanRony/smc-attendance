import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const user = authService.getUser();
  if (user && user.type === 'admin') {
    return true;
  } else {
    return false;
  }
};

