import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';

export interface Shop {
  _id: string;
  shopName: string;
  fullName: string;
  shopTagline: string;
  status: string;
  isBoosted?: boolean;
}

@Component({
  selector: 'app-admin-shop-management',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: 'admin-shop-management.html',
  styleUrls: ['./admin-shop-management.css']
})
export class AdminShopManagement implements OnInit {
  private http = inject(HttpClient);
  shops: Shop[] = [];
  private router = inject(Router);

  ngOnInit(): void {
    this.fetchApprovedShops();
  }

  fetchApprovedShops(): void {
    const apiUrl = 'http://localhost:5000/api/admin/shops/approved'; 
    
    this.http.get<Shop[]>(apiUrl).subscribe({
      next: (data) => {
        this.shops = data;
      },
      error: (error) => {
        console.error('Error fetching shops:', error);
      }
    });
  }

  // 2. Toggle Boost Listing
  toggleBoost(shop: Shop): void {
    const newBoostStatus = !shop.isBoosted;
    const apiUrl = `http://localhost:5000/api/admin/shops/${shop._id}/boost`;

    this.http.put(apiUrl, { isBoosted: newBoostStatus }).subscribe({
      next: () => {
        shop.isBoosted = newBoostStatus; // Update UI instantly
        console.log(`Shop ${shop.shopName} boost status: ${newBoostStatus}`);
      },
      error: (err) => console.error('Error boosting shop:', err)
    });
  }

  // 3. Disable/Enable Shop
  toggleShopStatus(shop: Shop): void {
    // If currently Approved, switch to Disabled, and vice versa
    const newStatus = shop.status === 'Disabled' ? 'Approved' : 'Disabled';
    const apiUrl = `http://localhost:5000/api/admin/shops/${shop._id}/status`;

    // Confirm action
    if(confirm(`Are you sure you want to change status to ${newStatus}?`)) {
        this.http.put(apiUrl, { status: newStatus }).subscribe({
        next: () => {
            shop.status = newStatus; // Update UI
        },
        error: (err) => console.error('Error changing shop status:', err)
        });
    }
  }
  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}