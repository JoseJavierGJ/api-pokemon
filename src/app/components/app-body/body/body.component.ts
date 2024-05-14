import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { LoginComponent } from '../../login/login.component';

@Component({
  selector: 'app-body',
  standalone: true,
  templateUrl: './body.component.html',
  styleUrl: './body.component.css',
  imports: [RouterLink, FormsModule, CommonModule, LoginComponent]
})


export class BodyComponent {
  username: string = '';
  password: string = '';
  isLoggedIn: boolean = false; 

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    const { username, password } = this;
    if (this.authService.login(username, password)) {
      this.isLoggedIn = true;
      this.router.navigate(['/inicio']);
    } else {
      alert('Credenciales inválidas');
    }
  }
}
