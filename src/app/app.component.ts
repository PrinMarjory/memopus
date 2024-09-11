import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'memopus'; // Titre de l'application
  isLoggedIn = false; // État de connexion de l'utilisateur

  /**
   * Constructeur du composant racine.
   * 
   * @param authService - Service pour gérer l'authentification de l'utilisateur.
   * @param router - Service pour gérer la navigation entre les pages.
   */
  constructor(public authService: AuthService, private router: Router) {}

  /**
   * Initialisation du composant.   
   * Ce hook de cycle de vie est appelé une fois que le composant est initialisé.
   * Il souscrit à l'observable pour écouter les changements dans l'état de connexion
   * de l'utilisateur et met à jour la propriété `isLoggedIn`.
   */
  ngOnInit(): void {
    this.authService.isLoggedIn().subscribe({
      next: (isLoggedIn) => {
        this.isLoggedIn = isLoggedIn;
      },
      error: (error) => {
        console.error('Erreur lors de la vérification de l\'état de connexion:', error);
      }
    });
  }

  /**
   * Déconnecte l'utilisateur en appelant la méthode `logout` du service AuthService.
   * Une fois l'utilisateur déconnecté, il est redirigé vers la page de connexion.
   */
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

