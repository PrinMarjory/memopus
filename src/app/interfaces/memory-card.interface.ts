import { ColumnInterface } from "./column.interface";

export interface MemoryCardInterface {
    id: number;
    question: string;
    answer: string;
    description: string;
    tag: string;
    column: ColumnInterface;
}

export interface NewCardInterface extends Omit<MemoryCardInterface, 'id'> {}
export interface PatchCardInterface extends Partial<NewCardInterface> {}