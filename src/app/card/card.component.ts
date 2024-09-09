import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MemoryCard } from '../interfaces/memory-card.interface';

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
  imports: [],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {
  /**
   * La carte mémoire à afficher.
   * 
   * @type {MemoryCard}
   */
  @Input() card!: MemoryCard;
  @Output() edit = new EventEmitter<MemoryCard>();
  @Output() delete = new EventEmitter<MemoryCard>();

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
}
