import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [FormsModule,CommonModule,RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
   email = '';
  password = '';
  confirmPassword = '';

  constructor(private router: Router) {}

  onRegister() {
    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    if (this.email && this.password) {
      localStorage.setItem('user', JSON.stringify({ email: this.email }));
      alert('Registration successful!');
      this.router.navigate(['/login']); // go to login after register
    } else {
      alert('Please fill all fields.');
    }
  }
}
