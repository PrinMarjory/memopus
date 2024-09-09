import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';

/**
 * Définition des routes de l'application.
 * 
 * @type {Routes}
 */
export const routes: Routes = [
  /**
   * Route pour le composant de connexion.
   * 
   * @path /login
   * @component LoginComponent
   */
  { path: 'login', component: LoginComponent },

  /**
   * Route pour le composant d'accueil.
   * 
   * @path /home
   * @component HomeComponent
   */
  { path: 'home', component: HomeComponent },

  /**
   * Route par défaut qui redirige vers la page de connexion.
   * 
   * @path /
   * @redirectTo /login
   * @pathMatch full
   */
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
