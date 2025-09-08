import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Navbar } from "../navbar/navbar";


@Component({
  selector: 'app-homepage',
  imports: [RouterModule, Navbar],
  templateUrl: './homepage.html',
  styleUrl: './homepage.css'
})
export class Homepage {

}
