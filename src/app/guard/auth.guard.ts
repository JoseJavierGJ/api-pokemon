import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router, private snackBar: MatSnackBar) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    } else {
      // alert('Debes iniciar sesión para acceder a esta página.'); // Me sale error en consola con el alert
      this.snackBar.open('Debes iniciar sesión para acceder a esta página.', 'Cerrar', {
        duration: 3000 
      });
      this.router.navigate(['/']);
      return false;
    }
  }
}
