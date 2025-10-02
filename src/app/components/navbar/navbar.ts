import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterOutlet],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  isLoggedIn = false;

  constructor(private router: Router) {}

  updateCart() {
    if (this.isLoggedIn) {
      // go to cart page
      this.router.navigate(['/homeprod']);
    } else {
      // go to login/register
      this.router.navigate(['/login']);
    }
  }
}
