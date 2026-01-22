import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SellerGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const isLoggedIn = localStorage.getItem('userRole') === 'seller';

    if (!isLoggedIn) {
      this.router.navigate(['/seller']); // redirect to login page
      return false;
    }

    return true;
  }
}
