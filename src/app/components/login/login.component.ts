import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';


/**
 * Composant de connexion.
 * Gère le formulaire de connexion et l'authentification de l'utilisateur.
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  /** Formulaire de connexion */
  loginForm!: FormGroup;

  /**
   * Constructeur du composant de connexion.
   * @param fb - FormBuilder pour créer le formulaire.
   * @param authService - Service d'authentification pour vérifier les informations de connexion.
   * @param router - Router pour naviguer après une connexion réussie.
   */
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}
 
  /**
   * Initialisation du composant.
   * Crée le formulaire de connexion et vérifie si l'utilisateur est déjà connecté.
   */
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    // Rediriger vers la page d'accueil si l'utilisateur est déjà connecté
    this.authService.isLoggedIn().subscribe({
      next: (isLoggedIn) => {
        if (isLoggedIn) {
          this.router.navigate(['/home']);
        }
      },
      error: (error) => {
        console.error('Erreur lors de la vérification de l\'état de connexion:', error);
      }
  });
  }
 
  /**
   * Soumet le formulaire de connexion.
   * Vérifie les informations de connexion via le service d'authentification.
   */
  onSubmit(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          console.log('Connexion réussie:', response);
          if (response) {
            this.router.navigate(['/home']);
          } else {
            alert('Identifiants de connexion invalides');
          }
        },
        error: (error) => {
          console.error('Erreur lors de la connexion:', error);
          alert('Une erreur est survenue lors de la connexion. Veuillez réessayer.');
        }
      });
    }
  }
}
