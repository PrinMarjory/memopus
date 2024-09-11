import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MemoryCardService } from '../../services/memory-card.service';
import { MemoryCardInterface, NewCardInterface, PatchCardInterface } from '../../interfaces/memory-card.interface';
import { ColumnInterface } from '../../interfaces/column.interface';
import { CardComponent } from '../card/card.component';

/**
 * Composant d'accueil de l'application.
 * Permet de gérer les cartes mémoire, leur affichage par colonnes, et les interactions
 * pour ajouter, modifier ou supprimer des cartes.
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
  memoryCards: MemoryCardInterface[] = []; //Liste des cartes mémoire
  tags: string[] = []; //Liste des tags existants
  selectedTag: string = 'Tous les tags'; //Tag sélectionné, par défaut "Tous les tags"
  columns: ColumnInterface[] = [ //Colonnes pour les cartes mémoire
    { id: 1, label: 'A apprendre', order: 1 },
    { id: 2, label: 'Je sais un peu', order: 2 },
    { id: 3, label: 'Je sais bien', order: 3 },
    { id: 4, label: 'Je sais parfaitement', order: 4 }
  ];
  newCardForm!: FormGroup; //Formulaire pour ajouter ou modifier une carte
  isEditMode = false; //Mode édition ou ajout
  editCardId: number | null = null; //ID de la carte en cours d'édition
  deleteCardId: number | null = null;//ID de la carte à supprimer
  alertMessage: string | null = null; // Message d'alerte à afficher
  alertType: 'success' | 'danger' = 'success'; // Type d'alerte, par défaut succès

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
   * Récupère les cartes mémoire depuis le service et initialise le formulaire.
   */
  ngOnInit(): void {
    this.checkUserLoginStatus();
    this.loadMemoryCards();
    this.initializeForm();
  }

  // ======================================================
  // Méthodes d'initialisation et validation
  // ======================================================

  /**
   * Vérifie si l'utilisateur est connecté. Redirige vers la page de connexion si nécessaire.
   */
  checkUserLoginStatus(): void {
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

  /**
   * Initialise le formulaire de création et modification de carte mémoire.
   */
  initializeForm(): void {
    this.newCardForm = this.fb.group({
      question: ['', Validators.required],
      answer: ['', Validators.required],
      description: [''],
      tag: ['', this.tagValidator.bind(this)],
      newTag: [''],
      column: ['']
    });

    // Réactivez les validateurs lorsque newTag change
    this.newCardForm.get('newTag')?.valueChanges.subscribe(() => {
      this.newCardForm.get('tag')?.updateValueAndValidity();
    });
  }

  /**
   * Validator personnalisé pour le champ 'tag'.
   * Si le champ 'newTag' est vide, 'tag' devient requis.
   * 
   * @param control - Le contrôle du formulaire à valider.
   * @returns Un objet de validation ou null si valide.
   */
  tagValidator(control: any): { [key: string]: any } | null {
    if (!this.newCardForm) {
      return null;
    }
    const newTag = this.newCardForm.get('newTag')?.value;
    const tag = control.value;
    
    if (!newTag && !tag) {
      return { required: true }; // Tag est requis si aucun nouveau tag n'est saisi
    }
    return null;
  }

  // ======================================================
  // Méthodes de gestion des cartes mémoire
  // ======================================================

  /**
   * Récupère les cartes mémoire depuis le service.
   */
  loadMemoryCards(): void {
    this.memoryCardService.getMemoryCards().subscribe({
      next: (cards) => {
        this.memoryCards = cards;
        console.log('Cartes chargées:', this.memoryCards);
        this.tags = [...new Set(cards.map(card => card.tag))]; // Récupérer les tags uniques
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des cartes mémoire:', error);
        this.showAlert('Erreur lors du chargement des cartes mémoire', 'danger');
      }
    });
  }

  /**
   * Ajoute une nouvelle carte mémoire.
   * Envoie la nouvelle carte au service et met à jour l'interface.
   */
  addCard(): void {
    if (this.newCardForm.valid) {
      // Si un nouveau tag est saisi, utilisez-le, sinon utilisez le tag sélectionné
      let tag = this.newCardForm.value.newTag || this.newCardForm.value.tag;
      let column = this.columns.find(col => col.label === this.newCardForm.value.column);

      // Créer un objet pour la nouvelle carte
      const newCard: NewCardInterface = {
        question: this.newCardForm.value.question,
        answer: this.newCardForm.value.answer,
        description: this.newCardForm.value.description,
        tag: tag,
        column: column || this.columns[0]  // Toujours par défaut "A apprendre" pour les nouvelles cartes
      };

      // Ajout temporaire de la carte avec un ID temporaire pour l'interface utilisateur
      const tempId = Date.now();
      const tempCard = { ...newCard, id: tempId };
      this.memoryCards.push(tempCard);

      // Appel au service pour ajouter la nouvelle carte sans ID
      this.memoryCardService.addMemoryCard(newCard).subscribe({
        next: (addedCard: MemoryCardInterface) => {
          this.showAlert('Carte ajoutée avec succès', 'success');

          // Remplacer la carte temporaire par la carte réelle
          const index = this.memoryCards.findIndex(c => c.id === tempId);
          if (index !== -1) {
            this.memoryCards[index] = addedCard;
          }

          // Mettre à jour la liste des tags si un nouveau tag est saisi
          if (this.newCardForm.value.newTag) {
            if (!this.tags.includes(this.newCardForm.value.newTag)) {
              this.tags.push(this.newCardForm.value.newTag);
            }
          }
          
          // Réinitialiser le formulaire et fermer la modale
          this.newCardForm.reset();
          this.hideAddModal("addCardModal");

        },
        error: (error) => {
          console.error('Erreur lors de l\'ajout de la carte mémoire:', error);
          this.showAlert('Erreur lors de l\'ajout de la carte', 'danger');
          // Revenir à l'état précédent en cas d'erreur
          this.memoryCards = this.memoryCards.filter(c => c.id !== tempId);
        }
      });
    }
  }

  /**
   * Modifie une carte mémoire existante.
   * Envoie la carte modifiée au service et met à jour l'interface.
   */
  updateCard(): void {
    if (this.newCardForm.invalid || this.editCardId === null) {
      return;
    }

    // Si un nouveau tag est saisi, utilisez-le, sinon utilisez le tag sélectionné
    let tag = this.newCardForm.value.newTag || this.newCardForm.value.tag;
    let columnLabel = this.newCardForm.value.column;
    let column = this.columns.find(col => col.label === columnLabel); 

    // Créer un objet partiel pour la mise à jour
    const updatedCard: PatchCardInterface = {
      question: this.newCardForm.value.question,
      answer: this.newCardForm.value.answer,
      description: this.newCardForm.value.description,
      tag: tag,
      column: column 
    };

    this.memoryCardService.updateMemoryCard(this.editCardId, updatedCard).subscribe({
      next: (card) => {
        this.showAlert('Carte modifiée avec succès', 'success');

        // Mettre à jour la carte dans la liste
        const index = this.memoryCards.findIndex(c => c.id === this.editCardId);
        if (index !== -1) {
          this.memoryCards[index] = card;
        }

        // Mettre à jour la liste des tags si un nouveau tag est saisi
        if (this.newCardForm.value.newTag) {
          if (!this.tags.includes(this.newCardForm.value.newTag)) {
            this.tags.push(this.newCardForm.value.newTag);
          }
        }

        // Réinitialiser le formulaire et fermer la modale
        this.newCardForm.reset();
        this.isEditMode = false;
        this.editCardId = null;
        this.hideAddModal("addCardModal");
      },
      error: (error) => {
        console.error('Erreur lors de la modification de la carte mémoire:', error);
        this.showAlert('Erreur lors de la modification de la carte', 'danger');
      }
    });
  }

  /**
   * Supprime une carte mémoire
   * Envoie la demande de suppression au service et met à jour l'interface.
   */
  deleteCard(): void {
    if (this.deleteCardId === null) {
      return;
    }

    this.memoryCardService.deleteMemoryCard(this.deleteCardId).subscribe({
      next: () => {
        this.showAlert('Carte supprimée avec succès', 'success');

        // Supprimer la carte de la liste
        this.memoryCards = this.memoryCards.filter(card => card.id !== this.deleteCardId);

        // Mettre à jour la liste des tags
        const existingTags = new Set(this.memoryCards.map(card => card.tag));
        this.tags = [...existingTags];

        // Réinitialiser le tag sélectionné si la carte supprimée était la seule de ce tag
        if (this.selectedTag !== 'Tous les tags' && !this.memoryCards.some(card => card.tag === this.selectedTag)) {
          this.selectedTag = 'Tous les tags';
        }
        // Réinitialiser l'ID de la carte à supprimer et fermer la modale
        this.deleteCardId = null;
        this.hideAddModal("deleteCardModal");
      },
      error: (error) => {
        console.error('Erreur lors de la suppression de la carte mémoire:', error);
        this.showAlert('Erreur lors de la suppression de la carte', 'danger');
      }
    });
  }


  // ======================================================
  // Méthode de gestion des colonnes et des tags
  // ======================================================

  /**
   * Récupère les cartes mémoire par colonne et par tag sélectionné.
   * 
   * @param columnLabel - Le label de la colonne à filtrer.
   * @returns Les cartes mémoire de la colonne spécifiée.
   */
  getCardsByColumn(columnLabel: 'A apprendre' | 'Je sais un peu' | 'Je sais bien' | 'Je sais parfaitement'): MemoryCardInterface[] {
    if (this.selectedTag === 'Tous les tags') {
      return this.memoryCards.filter(card => card.column.label === columnLabel);
    } else {
      return this.memoryCards.filter(card => card.column.label === columnLabel && card.tag === this.selectedTag);
    }
  }

  /**
   * Filtre les cartes mémoire en fonction du tag sélectionné.
   * 
   * @param tag - Le tag utilisé pour le filtrage.
   */
  filterByTag(tag: string): void {
    this.selectedTag = tag;
  }

  /**
   * Déplace une carte mémoire vers la gauche.
   * 
   * @param card - La carte mémoire à déplacer.
   */
  moveCardLeft(card: MemoryCardInterface): void {
    const currentColumnIndex = this.columns.findIndex(col => col.id === card.column.id);
    const newColumnIndex = (currentColumnIndex - 1 + this.columns.length) % this.columns.length;
    card.column = this.columns[newColumnIndex];
    this.updateCardColumn(card);
  }

  /**
   * Déplace une carte mémoire vers la droite.
   * 
   * @param card - La carte mémoire à déplacer.
   */
  moveCardRight(card: MemoryCardInterface): void {
    const currentColumnIndex = this.columns.findIndex(col => col.id === card.column.id);
    const newColumnIndex = (currentColumnIndex + 1) % this.columns.length;
    card.column = this.columns[newColumnIndex];
    this.updateCardColumn(card);
  }

  /**
   * Met à jour la colonne de la carte mémoire dans le backend.
   * 
   * @param card - La carte mémoire à mettre à jour.
   */
  updateCardColumn(card: MemoryCardInterface): void {
    this.memoryCardService.updateMemoryCard(card.id, card).subscribe({
      next: (updatedCard) => {
        this.showAlert('Carte déplacée avec succès', 'success');
        console.log('Card updated successfully:', updatedCard);
      },
      error: (err) => {
        console.error('Error updating card:', err);
        this.showAlert('Erreur lors de la mise à jour de la carte', 'danger');  
      }
    });
  }


  // ======================================================
  // Méthodes d'interactions avec l'interface utilisateur
  // ======================================================

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
  openEditModal(card: MemoryCardInterface): void {
    this.isEditMode = true;
    this.editCardId = card.id;

    // Préremplir tous les champs
    this.newCardForm.patchValue({
      question: card.question,
      answer: card.answer,
      description: card.description,
      tag: card.tag,
      newTag: '', 
      column: card.column.label
    });
    
    const modal = new (window as any).bootstrap.Modal(document.getElementById('addCardModal')!);
    modal.show();
  }
  
  /**
   * Ferme la modale d'ajout ou de modification
   * 
   * @param modalId - L'identifiant de la modale à fermer.
   */
  hideAddModal(modalId: string): void {
    const modalElement = document.getElementById(modalId) as any;
    if (modalElement) {
      const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
      modal.hide();
    }
  }

  /**
   * Ouvre la modale de confirmation de suppression.
   * 
   * @param card - La carte mémoire à supprimer.
   */
  openDeleteModal(card: MemoryCardInterface): void {
    this.deleteCardId = card.id;
    const modalElement = document.getElementById('deleteCardModal') as any;
    if (modalElement) {
      const modal = new (window as any).bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  /**
   * Méthode pour afficher un message d'alerte avec un délai de suppression
   * 
   * @param message - Le message à afficher 
   * @param type - Le type d'alerte (success ou danger)
   * @param duration - La durée d'affichage de l'alerte en millisecondes 
   */
  showAlert(message: string, type: 'success' | 'danger' = 'success', duration: number = 3000): void {
    this.alertMessage = message;
    this.alertType = type;
  
    // Cacher l'alerte après un certain délai (3 secondes par défaut)
    setTimeout(() => {
    this.alertMessage = null;
    }, duration);
  }
}







