import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';

/**
 * Définition des routes de l'application.
 * 
 * @type {Routes} - Type Angular représentant une collection de routes.
 */
export const routes: Routes = [
  /**
   * Route pour le composant de connexion.
   * 
   * @property {string} path - Chemin de la route.
   * @property {any} component - Composant associé à cette route (LoginComponent).
   */
  { path: 'login', component: LoginComponent },

  /**
   * Route pour le composant d'accueil.
   * 
   * @property {string} path - Chemin de la route.
   * @property {any} component - Composant associé à cette route (HomeComponent).
   */
  { path: 'home', component: HomeComponent },

  /**
   * Route par défaut qui redirige vers la page de connexion.
   * Si l'utilisateur tente d'accéder à la racine du site ("/"),
   * il sera automatiquement redirigé vers la page de connexion ("/login").
   * 
   * @property {string} path - Chemin de la route par défaut, vide pour la racine.
   * @property {string} redirectTo - Chemin vers lequel rediriger (ici, "/login").
   * @property {string} pathMatch - Spécifie la manière dont Angular fait correspondre l'URL ("full" signifie correspondance complète).
   */
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
