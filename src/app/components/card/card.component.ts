import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MemoryCardInterface } from '../../interfaces/memory-card.interface';

/**
 * Composant pour afficher une carte mémoire.
 * 
 * Ce composant permet de visualiser une carte mémoire avec les options pour 
 * l'éditer, la supprimer, ou la déplacer à gauche ou à droite.
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
  @Input() card!: MemoryCardInterface; // La carte mémoire à afficher
  @Output() edit = new EventEmitter<MemoryCardInterface>(); // Événement émis pour éditer la carte
  @Output() delete = new EventEmitter<MemoryCardInterface>(); // Événement émis pour supprimer la carte
  @Output() leftArrow = new EventEmitter<MemoryCardInterface>(); // Événement émis pour déplacer la carte vers la gauche
  @Output() rightArrow = new EventEmitter<MemoryCardInterface>(); // Événement émis pour déplacer la carte vers la droite

  expanded: boolean = false; // État d'expansion de la carte

  /**
   * Émet un événement pour demander l'édition de la carte.
   */
  onEdit(): void {
    this.edit.emit(this.card);
  }

  /**
   * Émet un événement pour demander la suppression de la carte.
   */
  onDelete(): void {
    this.delete.emit(this.card);
  }

  /**
   * Émet un événement pour déplacer la carte vers la gauche.
   */
  onLeftArrow(): void {
    this.leftArrow.emit(this.card);
  }

  /**
   * Émet un événement pour déplacer la carte vers la droite.
   */
  onRightArrow(): void {
    this.rightArrow.emit(this.card);
  }

  /**
   * Bascule l'état d'expansion de la carte.
   * Si la carte est actuellement étendue, elle sera réduite, et vice versa.
   */
  toggle(): void {
    this.expanded = !this.expanded;
  }
}
