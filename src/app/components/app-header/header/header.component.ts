import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { Location } from '@angular/common';



@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  imports: [RouterLink, MatIconModule, CommonModule]
})
export class HeaderComponent {
  constructor(private location: Location, private router: Router) {}

  goBack() {
    window.location.href = '/'; 
    // window.location.reload();
  }
}
