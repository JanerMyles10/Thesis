import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Navbar } from '../navbar/navbar';

export interface Product {
  id: number;
  name: string;
  price: number;
  image?: string;
  rating?: number;
}

@Component({
  selector: 'app-homepage',
  imports: [RouterModule, Navbar, CommonModule],
  templateUrl: './homepage.html',
  styleUrl: './homepage.css'
})
export class Homepage {}
