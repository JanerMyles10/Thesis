import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Navbar } from '../navbar/navbar';



@Component({
  selector: 'app-homepage',
  imports: [RouterModule, Navbar, CommonModule,],
  templateUrl: './homepage.html',
  styleUrl: './homepage.css'
})
export class Homepage {
}
