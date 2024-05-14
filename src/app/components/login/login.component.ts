import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatCheckboxModule} from '@angular/material/checkbox';


@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  imports: [RouterLink, FormsModule, CommonModule, LoginComponent, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatIconModule, MatCheckboxModule]
})

export class LoginComponent {
  username: string = '';
  password: string = '';
  isLoggedIn: boolean = false; 
  value = 'Clear me';
  hide: boolean = true;

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    const { username, password } = this;
    if (!username && !password) {
      alert('Favor de llenar el formulario');
    } else if (!username) {
      alert('Favor de ingresar el usuario');
    } else if (!password) {
      alert('Favor de ingresar la contraseña');
    } else {
      if (this.authService.login(username, password)) {
        this.isLoggedIn = true;
        this.router.navigate(['/inicio']);
      } else {
        alert('Credenciales inválidas');
      }
    }
  }  

  togglePasswordVisibility(): void {
    this.hide = !this.hide;
  }
}

