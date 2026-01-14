import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-shop',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './create-shop.html',
  styleUrls: ['./create-shop.css']
})
export class CreateShopComponent { // Or 'CreateShop' if that's your convention

  private http = inject(HttpClient);
  private router = inject(Router);

  notification = {
    show: false,
    type: 'success',
    message: ''
  };
  private notificationTimer: any;


  shopDetails = {
    shopName: '',
    shopTagline: '',
    shopDescription: '',
    fullName: '',
    address: '',
    phoneNumber: ''
  };

  selectedIdFile: File | null = null;

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedIdFile = file;
    }
  }

  onSubmit(): void {
    if (!this.selectedIdFile) {
      this.showNotification('error', 'Please upload your National ID before submitting.');
      return;
    }

    // --- VVV THIS IS THE FIX VVV ---
    // 1. Get the logged-in user's ID from localStorage.
    const userId = localStorage.getItem('userId');

    // 2. Check if the userId exists. If not, the user isn't logged in.
    if (!userId) {
      this.showNotification('error', 'You must be logged in to create a shop.');
      // Optional: redirect to login after a short delay
      setTimeout(() => this.router.navigate(['/login']), 2000);
      return;
    }
    // ------------------------------------

    const formData = new FormData();
    
    // --- VVV THIS IS THE FIX VVV ---
    // 3. Append the userId to the data being sent to the backend.
    formData.append('userId', userId);
    // ------------------------------------
    
    // Append the rest of your form data
    formData.append('shopName', this.shopDetails.shopName);
    formData.append('shopTagline', this.shopDetails.shopTagline);
    formData.append('shopDescription', this.shopDetails.shopDescription);
    formData.append('fullName', this.shopDetails.fullName);
    formData.append('address', this.shopDetails.address);
    formData.append('phoneNumber', this.shopDetails.phoneNumber);
    formData.append('nationalId', this.selectedIdFile, this.selectedIdFile.name);

    const apiUrl = 'http://localhost:5000/api/shop-applications';

    this.http.post(apiUrl, formData).subscribe({
      next: (response) => {
        this.showNotification('success', 'Success! Redirecting you to the home page...');
        setTimeout(() => {
          this.router.navigate(['/homeprod']); 
        }, 2000);
      },
      error: (error) => {
        console.error('Error submitting application:', error); // Good to log the actual error
        this.showNotification('error', 'There was an error submitting your application.');
      }
    });
  }

  // ... (your showNotification, displayNotification, and hideNotification functions remain the same)
  showNotification(type: 'success' | 'error', message: string): void {
    if (this.notification.show) {
      this.hideNotification();
      setTimeout(() => this.displayNotification(type, message), 400);
    } else {
      this.displayNotification(type, message);
    }
  }

  private displayNotification(type: 'success' | 'error', message: string): void {
    this.notification.type = type;
    this.notification.message = message;
    this.notification.show = true;
    
    if (type !== 'success') {
      this.notificationTimer = setTimeout(() => {
        this.hideNotification();
      }, 4000);
    }
  }

  hideNotification(): void {
    clearTimeout(this.notificationTimer);
    this.notification.show = false;
  }
}