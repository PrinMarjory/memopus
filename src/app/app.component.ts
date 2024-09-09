import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'memopus';
  isLoggedIn = false;

  /**
   * Constructeur du composant racine.
   * 
   * @param authService 
   * @param router 
   */
  constructor(public authService: AuthService, private router: Router) {}

  /**
   * Méthode pour déconnecter l'utilisateur.
   */
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

