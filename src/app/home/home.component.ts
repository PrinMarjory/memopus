import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { MemoryCard } from '../interfaces/memory-card.interface';
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
    /**
   * Liste des cartes mémoire.
   * 
   * @type {MemoryCard[]}
   */
  memoryCards: MemoryCard[] = [
    { id: 1, question: 'Qu\'est-ce qu\'Angular ?', answer: 'Un framework pour applications web.', description: 'Angular est une plateforme pour créer des applications web mobiles et de bureau.' },
    { id: 2, question: 'Qu\'est-ce que TypeScript ?', answer: 'Un sur-ensemble de JavaScript.', description: 'TypeScript est un langage de programmation fortement typé qui se base sur JavaScript.' },
    { id: 3, question: 'Qu\'est-ce qu\'une API ?', answer: 'Une interface de programmation d\'application.', description: 'Une API est un ensemble de règles qui permet à différents logiciels de communiquer entre eux.' },
    { id: 4, question: 'Qu\'est-ce que le DOM ?', answer: 'Le Document Object Model.', description: 'Le DOM est une interface de programmation pour les documents HTML et XML.' },
    { id: 5, question: 'Quelle est la différence entre une variable locale et une variable globale ?', answer: 'Les variables locales sont définies dans une fonction et ne sont accessibles que dans cette fonction, tandis que les variables globales sont accessibles dans tout le code.', description: 'Les variables locales existent uniquement dans le contexte de leur fonction, tandis que les variables globales existent dans tout le programme.' },
    { id: 6, question: 'Qu\'est-ce que le lazy loading ?', answer: 'Un principe de chargement différé.', description: 'Le lazy loading est une technique qui consiste à différer le chargement de certains composants ou données jusqu\'à ce qu\'ils soient réellement nécessaires.' },
    { id: 7, question: 'Qu\'est-ce que le responsive design ?', answer: 'Un design adaptatif.', description: 'Le responsive design est une approche du développement web qui vise à créer des sites web qui fonctionnent sur une variété de dispositifs et de tailles d\'écran.' },
    { id: 8, question: 'Qu\'est-ce que le versionnage de code ?', answer: 'Un système pour suivre les modifications du code.', description: 'Le versionnage de code est un système qui permet de suivre les modifications apportées au code source d\'un projet au fil du temps.' },
    { id: 9, question: 'Qu\'est-ce que le MVC ?', answer: 'Modèle-Vue-Contrôleur.', description: 'Le MVC est un patron de conception qui sépare une application en trois parties : le modèle (les données), la vue (l\'interface utilisateur) et le contrôleur (la logique métier).' },
    { id: 10, question: 'Qu\'est-ce que le Cross-Origin Resource Sharing (CORS) ?', answer: 'Une politique de sécurité pour les requêtes entre différents domaines.', description: 'CORS est une politique qui permet de gérer les requêtes HTTP entre différents domaines en ajoutant des en-têtes HTTP spécifiques.' }
  ];

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
