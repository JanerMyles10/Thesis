import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  isLoggedIn = false;

  constructor(private router: Router) {}

  updateCart() {
    if (this.isLoggedIn) {

      this.router.navigate(['/']);
    } else {

      this.router.navigate(['/login']);
    }
  }
}
