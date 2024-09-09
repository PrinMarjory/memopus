import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

/**
 * Composant d'accueil.
 * 
 * @selector app-home
 * @templateUrl ./home.component.html
 * @styleUrls ['./home.component.css']
 */
@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  /**
   * Constructeur du composant d'accueil.
   * 
   * @param {AuthService} authService - Service d'authentification.
   * @param {Router} router - Service de routage.
   */
  constructor(private authService: AuthService, private router: Router) {}

  /**
   * Initialisation du composant.
   */
  ngOnInit(): void {
    // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
    this.authService.isLoggedIn().subscribe({
      next: (isLoggedIn) => {
        if (!isLoggedIn) {
          this.router.navigate(['/login']);
        }
      },
      error: (error) => {
        console.error('Erreur lors de la vérification de l\'état de connexion:', error);
      }
    });
  }
}
