import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MemoryCardInterface, NewCardInterface, PatchCardInterface } from '../interfaces/memory-card.interface';

@Injectable({
  providedIn: 'root'
})
export class MemoryCardService {
  private apiUrl = 'http://localhost:3000/memoryCards';

  /**
   * Constructeur du service MemoryCardService.
   * 
   * @param http - Service HttpClient pour effectuer des requêtes HTTP.
   */
  constructor(private http: HttpClient) {}

  /**
   * Récupère les cartes mémoire depuis le serveur JSON.
   * 
   * @returns Un Observable contenant un tableau de MemoryCard.
   */
  getMemoryCards(): Observable<MemoryCardInterface[]> {
    return this.http.get<MemoryCardInterface[]>(this.apiUrl);
  }

  /**
   * Ajoute une nouvelle carte mémoire.
   * 
   * @param card - La carte mémoire à ajouter.
   * @returns Un Observable contenant la carte mémoire ajoutée.
   */
  addMemoryCard(card: NewCardInterface): Observable<MemoryCardInterface> {
    return this.http.post<MemoryCardInterface>(this.apiUrl, card);
  }

      /**
   * Met à jour une carte mémoire existante.
   * 
   * @param card - La carte mémoire à mettre à jour.
   */
  updateMemoryCard(id: number, card: PatchCardInterface): Observable<MemoryCardInterface> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<MemoryCardInterface>(url, card);
  }

  /**
   * Supprime une carte mémoire.
   * 
   * @param id - L'identifiant de la carte mémoire à supprimer. 
   */
  deleteMemoryCard(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}