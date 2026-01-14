import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {
  newUser = {
    email: '',
    password: '',
    name: ''
  };

  confirmPassword = '';
  passwordMismatch = false;

  constructor(private http: HttpClient, private router: Router) {}

  register() {
    if (this.newUser.password !== this.confirmPassword) {
      this.passwordMismatch = true;
      return;
    }
    this.passwordMismatch = false;

    // send data to backend
    this.http.post('http://localhost:5000/api/reg/register', this.newUser)
      .subscribe({
        next: (res: any) => {
          alert(res.message || 'Registration successful!');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          alert(err.error.message || 'Registration failed');
        }
      });
  }
  login(){
    this.router.navigate(["/login"])
  }
}
