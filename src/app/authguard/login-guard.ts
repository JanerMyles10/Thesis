import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const isLoggedIn = !!localStorage.getItem('user'); // check if user is logged in

    if (!isLoggedIn) {
      this.router.navigate(['/login']); // redirect to login page
      return false;
    }

    return true; 
  }
}
