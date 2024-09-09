import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MemoryCard } from '../interfaces/memory-card.interface';

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
  getMemoryCards(): Observable<MemoryCard[]> {
    return this.http.get<MemoryCard[]>(this.apiUrl);
  }

  /**
   * Ajoute une nouvelle carte mémoire.
   * 
   * @param card - La carte mémoire à ajouter.
   * @returns Un Observable contenant la carte mémoire ajoutée.
   */
    addMemoryCard(card: MemoryCard): Observable<MemoryCard> {
      return this.http.post<MemoryCard>(this.apiUrl, card);
    }

      /**
   * Met à jour une carte mémoire existante.
   * 
   * @param card - La carte mémoire à mettre à jour.
   */
  updateMemoryCard(card: MemoryCard): Observable<MemoryCard> {
    const url = `${this.apiUrl}/${card.id}`;
    return this.http.put<MemoryCard>(url, card);
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