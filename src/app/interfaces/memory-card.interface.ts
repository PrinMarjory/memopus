import { ColumnInterface } from "./column.interface";

/**
 * Interface représentant une carte mémoire.
 */
export interface MemoryCardInterface {
    id: number;
    question: string;
    answer: string;
    description: string;
    tag: string;
    column: ColumnInterface;
}

/**
 * Interface pour créer une nouvelle carte mémoire.
 * 
 * Hérite de toutes les propriétés de MemoryCardInterface sauf 'id', car l'id est généré automatiquement.
 * 
 * @extends {Omit<MemoryCardInterface, 'id'>}
 */
export interface NewCardInterface extends Omit<MemoryCardInterface, 'id'> {}

/**
 * Interface pour mettre à jour une carte mémoire existante.
 * 
 * Permet de modifier uniquement certaines propriétés de la carte mémoire.
 * 
 * @extends {Partial<NewCardInterface>}
 */
export interface PatchCardInterface extends Partial<NewCardInterface> {}