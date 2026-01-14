import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.html',
  styleUrls: ['./settings.css']
})
export class SettingsComponent {
  shop: any = {
    shopName: '',
    shopTagline: '',
    shopDescription: '',
    phoneNumber: '',
    address: ''
  };
  
  previewImage: string | ArrayBuffer | null = null;

  // Handle Image Upload Preview
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => this.previewImage = reader.result;
      reader.readAsDataURL(file);
    }
  }

  saveSettings() {
    alert('Settings Saved! (Connect this to your Backend API)');
    console.log(this.shop);
  }
}