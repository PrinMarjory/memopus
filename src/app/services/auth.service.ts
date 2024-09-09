import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject} from 'rxjs';
import { map, catchError } from 'rxjs/operators';

/**
 * Service d'authentification pour gérer les connexions utilisateur.
 * 
 * @@Injectable
 * @providedIn root
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  /**
   * URL du serveur JSON pour l'authentification.
   * @type {string}
   */
  private apiUrl = 'http://localhost:3000/auth';

   /**
   * État de connexion de l'utilisateur.
   * @type {BehaviorSubject<boolean>}
   */
   private loggedIn = new BehaviorSubject<boolean>(false);

  /**
   * Constructeur du service d'authentification.
   * 
   * @param {HttpClient} http - Client HTTP pour effectuer les requêtes.
   */
  constructor(private http: HttpClient) {}

  /**
   * Méthode pour connecter un utilisateur.
   * 
   * @param {Object} credentials - Les informations d'identification de l'utilisateur.
   * @param {string} credentials.username - Le nom d'utilisateur.
   * @param {string} credentials.password - Le mot de passe.
   * @returns {Observable<boolean>} - Un observable qui émet `true` si la connexion est réussie, sinon `false`.
   */
  login(credentials: { username: string; password: string }): Observable<boolean> {
    return this.http.post<{ success: boolean }>(this.apiUrl, credentials)
      .pipe(
        map(response => {
          this.loggedIn.next(response.success);
          return response.success;
        }),
        catchError(() => of(false))
      );
  }

  /**
   * Méthode pour déconnecter un utilisateur.
   */
    logout(): void {
      this.loggedIn.next(false);
    }

  /**
   * Méthode pour vérifier l'état de connexion de l'utilisateur.
   * @returns {Observable<boolean>} - Un observable qui émet l'état de connexion.
   */
  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

}
