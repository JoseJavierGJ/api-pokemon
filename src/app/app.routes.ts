import { Routes } from '@angular/router';
import { InicioComponent } from './components/inicio/inicio/inicio.component';
import { AuthGuard } from './guard/auth.guard';


export const routes: Routes = [ 
  { path: 'inicio', component: InicioComponent, canActivate:[AuthGuard] },
];
