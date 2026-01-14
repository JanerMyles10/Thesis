import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);

  user: any = {
    fullName: '',
    email: '',
    phoneNumber: '',
    address: '',
    bio: ''
  };
  
  userId: string | null = null;
  previewImage: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  successMessage: string = '';

  ngOnInit() {
    // Assuming you store userId in localStorage upon login
    // If you only store email, change logic to fetch by email
    const email = localStorage.getItem('userEmail');
    
    if (email) {
      this.fetchUserProfile(email);
    } else {
      this.router.navigate(['/login']);
    }
  }

  fetchUserProfile(email: string) {
    // Backend API to get user details
    this.http.get(`http://localhost:5000/api/user/profile/${email}`).subscribe({
      next: (data: any) => {
        this.user = data;
        if(data.profilePicUrl) {
          this.previewImage = data.profilePicUrl;
        }
      },
      error: (err) => console.error('Error fetching profile:', err)
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = e => this.previewImage = reader.result;
      reader.readAsDataURL(file);
    }
  }

  saveProfile() {
    const formData = new FormData();
    formData.append('fullName', this.user.fullName);
    formData.append('phoneNumber', this.user.phoneNumber);
    formData.append('address', this.user.address);
    formData.append('bio', this.user.bio);
    formData.append('email', this.user.email); // Identifier

    if (this.selectedFile) {
      formData.append('profilePic', this.selectedFile);
    }

    this.http.put('http://localhost:5000/api/user/update', formData).subscribe({
      next: (res: any) => {
        this.successMessage = 'Profile updated successfully!';
        // Update local name if needed
        localStorage.setItem('name', this.user.fullName);
        
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => alert('Failed to update profile')
    });
  }

  goBack() {
    this.router.navigate(['/homeprod']);
  }
}