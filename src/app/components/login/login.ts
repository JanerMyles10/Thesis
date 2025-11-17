import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  loginData = { email: '', password: '' };
  errorMessage = '';

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    this.http.post<any>('http://localhost:5000/api/reg/login', this.loginData).subscribe({
      next: (res) => {
        alert(res.message);

        localStorage.setItem('userLoggedIn', 'true');
        localStorage.setItem('userEmail', this.loginData.email);
        localStorage.setItem('name', res.name);

        this.router.navigate(['/homeprod']);
      },
      error: (err) => {
        this.errorMessage = err.error.message || 'Login failed';
      }
    });
  }

  reg(){
     this.router.navigate(['/reg']);
  }
}
