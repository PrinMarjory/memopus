import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { MemoryCard } from '../interfaces/memory-card.interface';
import { MemoryCardService } from '../services/memory-card.service';
import { CardComponent } from '../card/card.component';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';

/**
 * Composant d'accueil de l'application.
 * 
 * @selector app-home
 * @standalone true
 * @imports [CommonModule, CardComponent, FormsModule, ReactiveFormsModule]
 * @templateUrl ./home.component.html
 * @styleUrls ['./home.component.css']
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CardComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  memoryCards: MemoryCard[] = [];
  newCard: MemoryCard = { id: 0, question: '', answer: '', description: '' };
  newCardForm!: FormGroup;
  isEditMode = false;
  editCardId: number | null = null;

  /**
   * Constructeur du composant HomeComponent.
   * 
   * @param fb - FormBuilder pour créer le formulaire.
   * @param memoryCardService - Service pour récupérer les cartes mémoire.
   * @param authService - Service pour gérer l'authentification.
   * @param router - Service de navigation pour rediriger l'utilisateur.
   */
  constructor(
    private fb: FormBuilder,
    private memoryCardService: MemoryCardService, 
    private authService: AuthService, 
    private router: Router) {}

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

    // Récupérer les cartes mémoire
    this.loadMemoryCards();

    // Créer le formulaire pour ajouter une nouvelle carte
    this.newCardForm = this.fb.group({
      question: ['', Validators.required],
      answer: ['', Validators.required],
      description: ['']
    });
  }

  /**
   * Récupère les cartes mémoire depuis le service.
   */
  loadMemoryCards(): void {
    this.memoryCardService.getMemoryCards().subscribe({
      next: (cards) => {
        this.memoryCards = cards;
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des cartes mémoire:', error);
      }
    });
  }

  /**
   * Ouvre la modale en mode ajout.
   */
    openAddModal(): void {
      this.isEditMode = false;
      this.newCardForm.reset();
      this.editCardId = null;
      const modal = new (window as any).bootstrap.Modal(document.getElementById('addCardModal')!);
      modal.show();
    }

  /**
   * Ouvre la modale en mode modification et préremplit le formulaire.
   * 
   * @param card - La carte mémoire à modifier.
   */
    openEditModal(card: MemoryCard): void {
      this.isEditMode = true;
      this.editCardId = card.id;
      this.newCardForm.patchValue(card);
      const modal = new (window as any).bootstrap.Modal(document.getElementById('addCardModal')!);
      modal.show();
    }

  /**
   * Ajoute une nouvelle carte mémoire.
   */
  addCard(): void {
    if (this.newCardForm.valid) {
      const newCard: MemoryCard = this.newCardForm.value;

      // Mise à jour de l'interface
      const tempId = Date.now();
      const tempCard = { ...newCard, id: tempId };
      this.memoryCards.push(tempCard);

      this.memoryCardService.addMemoryCard(newCard).subscribe({
        next: (card) => {
          // Remplacer la carte temporaire par la carte réelle
          const index = this.memoryCards.findIndex(c => c.id === tempId);
          if (index !== -1) {
            this.memoryCards[index] = card;
          }
          this.newCardForm.reset();
        // Fermer la modale
        const modalElement = document.getElementById('addCardModal') as any;
        if (modalElement) {
          const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
          modal.hide();
        }
        },
        error: (error) => {
          console.error('Erreur lors de l\'ajout de la carte mémoire:', error);
          // Revenir à l'état précédent en cas d'erreur
          this.memoryCards = this.memoryCards.filter(c => c.id !== tempId);
        }
      });
    }

    
  }

  /**
   * Modifie une carte mémoire existante.
   */
  updateCard(): void {
    if (this.newCardForm.invalid || this.editCardId === null) {
      return;
    }

    const updatedCard: MemoryCard = { ...this.newCardForm.value, id: this.editCardId };

    this.memoryCardService.updateMemoryCard(updatedCard).subscribe({
      next: (card) => {
        const index = this.memoryCards.findIndex(c => c.id === this.editCardId);
        if (index !== -1) {
          this.memoryCards[index] = card;
        }
        this.newCardForm.reset();
        this.isEditMode = false;
        this.editCardId = null;
        // Fermer la modale
        const modalElement = document.getElementById('addCardModal') as any;
        if (modalElement) {
          const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
          modal.hide();
        }
      },
      error: (error) => {
        console.error('Erreur lors de la modification de la carte mémoire:', error);
      }
    });
  }
}
