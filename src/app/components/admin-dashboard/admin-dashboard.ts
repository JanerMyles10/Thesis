import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'seller' | 'admin';
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboard implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  users: User[] = [];

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    const apiUrl = 'http://localhost:5000/api/admin/users';
    
    this.http.get<User[]>(apiUrl).subscribe({
      next: (data) => {
        this.users = data;
        console.log('SUCCESS: Users have been fetched!', this.users);
      },
      error: (error) => {
        console.error('ERROR fetching users:', error);
      }
    });
  }

  onRoleChange(user: User, event: any): void {
    const newRole = event.target.value;
    const apiUrl = `http://localhost:5000/api/admin/users/${user._id}/role`;
    
    this.http.put<User>(apiUrl, { role: newRole }).subscribe({
      next: (updatedUser) => {
        user.role = updatedUser.role;
      },
      error: (error) => {
        console.error('Error updating user role:', error);
        event.target.value = user.role;
      }
    });
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}