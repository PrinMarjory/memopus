import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { MemoryCard } from '../interfaces/memory-card.interface';
import { MemoryCardService } from '../services/memory-card.service';
import { CardComponent } from '../card/card.component';

/**
 * Composant d'accueil de l'application.
 * 
 * @selector app-home
 * @standalone true
 * @imports [CommonModule, CardComponent]
 * @templateUrl ./home.component.html
 * @styleUrls ['./home.component.css']
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  memoryCards: MemoryCard[] = [];

  /**
   * Constructeur du composant HomeComponent.
   * 
   * @param memoryCardService - Service pour récupérer les cartes mémoire.
   * @param authService - Service pour gérer l'authentification.
   * @param router - Service de navigation pour rediriger l'utilisateur.
   */
  constructor(private memoryCardService: MemoryCardService, private authService: AuthService, private router: Router) {}

  /**
   * Initialisation du composant.
   * Redirige vers la page de connexion si l'utilisateur n'est pas connecté.
   * Récupère les cartes mémoire depuis le service.
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

    // Récupérer les cartes mémoire depuis le service
    this.memoryCardService.getMemoryCards().subscribe({
      next: (cards) => {
        this.memoryCards = cards;
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des cartes mémoire:', error);
      }
    });
  }
}
