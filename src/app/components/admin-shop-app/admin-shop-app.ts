import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';

export interface SimpleApplication {
  _id: string;
  shopName: string;
  fullName: string;
}

export interface DetailedApplication extends SimpleApplication {
  shopTagline: string;
  shopDescription: string;
  address: string;
  phoneNumber: string;
  nationalIdFilename: string;
}

@Component({
  selector: 'app-admin-shop-app',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-shop-app.html',
  styleUrls: ['./admin-shop-app.css']
})
export class AdminShopApp implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  
  applications: SimpleApplication[] = [];
  selectedApplication: DetailedApplication | null = null;

  ngOnInit(): void {
    this.fetchPendingApplications();
  }

  fetchPendingApplications(): void {
    //
    // --- THIS IS THE ONLY LINE THAT MATTERS FOR THIS ERROR ---
    // Please ensure it is EXACTLY as written below.
    //
    const apiUrl = 'http://localhost:5000/api/admin/shop-applications/pending';
    
    this.http.get<SimpleApplication[]>(apiUrl).subscribe({
      next: (data) => {
        this.applications = data;
      },
      error: (err) => {
        console.error('ERROR fetching pending applications:', err);
      }
    });
  }

  viewApplicationDetails(appId: string): void {
    const apiUrl = `http://localhost:5000/api/admin/shop-applications/${appId}`;
    this.http.get<DetailedApplication>(apiUrl).subscribe(data => {
      this.selectedApplication = data;
    });
  }

  closeModal(): void {
    this.selectedApplication = null;
  }

  approve(appId: string): void {
    const apiUrl = `http://localhost:5000/api/admin/shop-applications/${appId}/approve`;
    this.http.put(apiUrl, {}).subscribe(() => {
      this.applications = this.applications.filter(app => app._id !== appId);
      this.closeModal();
    });
  }

  reject(appId: string): void {
    alert('Reject functionality to be implemented.');
    this.closeModal();
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}