import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MemoryCardInterface } from '../interfaces/memory-card.interface';

/**
 * Composant pour afficher une carte mémoire.
 * 
 * @selector app-card
 * @templateUrl ./card.component.html
 * @styleUrls ['./card.component.css']
 */
@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {
  /**
   * La carte mémoire à afficher.
   * 
   * @type {MemoryCard}
   */
  @Input() card!: MemoryCardInterface;
  @Output() edit = new EventEmitter<MemoryCardInterface>();
  @Output() delete = new EventEmitter<MemoryCardInterface>();

  expanded: boolean = false;

  /**
   * Émet un événement lorsque le bouton "Modifier" est cliqué.
   */
    onEdit(): void {
      this.edit.emit(this.card);
    }

  /**
   * Émet un événement lorsque le bouton "Supprimer" est cliqué.
   */
    onDelete(): void {
      this.delete.emit(this.card);
    }

  /**
   * Bascule l'état d'expansion de la carte.
   */
  toggle(): void {
    this.expanded = !this.expanded;
  }
}
