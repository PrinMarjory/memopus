import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { MemoryCardInterface, NewCardInterface, PatchCardInterface } from '../interfaces/memory-card.interface';
import { ColumnInterface } from '../interfaces/column.interface';
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
  memoryCards: MemoryCardInterface[] = []; //Liste des cartes mémoire
  tags: string[] = []; //Liste des tags existants
  selectedTag: string = 'Tous les tags'; //Tag sélectionné, par défaut "Tous les tags"
  columns: ColumnInterface[] = [
    { id: 1, label: 'A apprendre', order: 1 },
    { id: 2, label: 'Je sais un peu', order: 2 },
    { id: 3, label: 'Je sais bien', order: 3 },
    { id: 4, label: 'Je sais parfaitement', order: 4 }
  ];
  newCardForm!: FormGroup;
  isEditMode = false;
  editCardId: number | null = null;
  deleteCardId: number | null = null;

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

    // Création du formulaire pour les nouvelles cartes
    this.newCardForm = this.fb.group({
      question: ['', Validators.required],
      answer: ['', Validators.required],
      description: [''],
      tag: ['', this.tagValidator.bind(this)], // Validator conditionnel 
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
      }
    });
  }

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
   * Filtre les cartes mémoire par tag.
   * 
   * @param tag - Le tag à filtrer.
   */
  filterByTag(tag: string): void {
    this.selectedTag = tag;
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
  openEditModal(card: MemoryCardInterface): void {
    this.isEditMode = true;
    this.editCardId = card.id;

    // Préremplir tous les champs, y compris le tag et la colonne
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
   * Ajoute une nouvelle carte mémoire.
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
      }
    });
  }

  /**
   * Supprime une carte mémoire
   */
  deleteCard(): void {
    if (this.deleteCardId === null) {
      return;
    }

    this.memoryCardService.deleteMemoryCard(this.deleteCardId).subscribe({
      next: () => {
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
      }
    });
  }
}
