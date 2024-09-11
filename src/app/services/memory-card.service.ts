import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MemoryCardInterface, NewCardInterface, PatchCardInterface } from '../interfaces/memory-card.interface';

@Injectable({
  providedIn: 'root'
})
export class MemoryCardService {
  /**
   * URL de l'API pour les cartes mémoire.
   * @type {string}
   */
  private apiUrl = 'http://localhost:3000/memoryCards';

  /**
   * Constructeur du service MemoryCardService.
   * 
   * @param {HttpClient} http - Service HttpClient pour effectuer des requêtes HTTP.
   */
  constructor(private http: HttpClient) {}

  /**
   * Récupère toutes les cartes mémoire depuis le serveur.
   * 
   * @returns {Observable<MemoryCardInterface[]>} - Un Observable contenant un tableau de cartes mémoire.
   */
  getMemoryCards(): Observable<MemoryCardInterface[]> {
    return this.http.get<MemoryCardInterface[]>(this.apiUrl);
  }

  /**
   * Ajoute une nouvelle carte mémoire.
   * 
   * @param {NewCardInterface} card - La carte mémoire à ajouter.
   * @returns {Observable<MemoryCardInterface>} - Un Observable contenant la carte mémoire ajoutée.
   */
  addMemoryCard(card: NewCardInterface): Observable<MemoryCardInterface> {
    return this.http.post<MemoryCardInterface>(this.apiUrl, card);
  }

  /**
   * Met à jour une carte mémoire existante.
   * 
   * @param {number} id - L'identifiant de la carte mémoire à mettre à jour.
   * @param {PatchCardInterface} card - Les modifications à appliquer à la carte mémoire.
   * @returns {Observable<MemoryCardInterface>} - Un Observable contenant la carte mémoire mise à jour.
   */
  updateMemoryCard(id: number, card: PatchCardInterface): Observable<MemoryCardInterface> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<MemoryCardInterface>(url, card);
  }

  /**
   * Supprime une carte mémoire.
   * 
   * @param {number} id - L'identifiant de la carte mémoire à supprimer.
   * @returns {Observable<void>} - Un Observable indiquant que la suppression est terminée.
   */
  deleteMemoryCard(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}