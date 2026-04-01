import { Injectable } from '@angular/core';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard = (route: any, state: any) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check if token exists in localStorage
  if (typeof localStorage !== 'undefined' && localStorage.getItem('token')) {
    return true;
  }

  router.navigate(['/auth/login']);
  return false;
};
