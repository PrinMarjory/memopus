/**
 * Interface représentant une colonne dans laquelle les cartes mémoire peuvent être organisées.
 */
export interface ColumnInterface {
    id: number;
    label: 'A apprendre' | 'Je sais un peu' | 'Je sais bien' | 'Je sais parfaitement';
    order: number;
}