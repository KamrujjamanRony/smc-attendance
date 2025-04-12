import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router: Router = inject(Router);
  const authService = inject(AuthService);
  const user = authService.getUser();
  if (user) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};

