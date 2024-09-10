export interface MemoryCardInterface {
    id: number;
    question: string;
    answer: string;
    description: string;
    tag: string;
    column: 'A apprendre' | 'Je sais un peu' | 'Je sais bien' | 'Je sais parfaitement';
}

export interface NewCardInterface extends Omit<MemoryCardInterface, 'id'> {}
export interface PatchCardInterface extends Partial<NewCardInterface> {}