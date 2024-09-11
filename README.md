# MEMOPUS

## Présentation de l'application

**Memopus** est une application web développée avec Angular qui permet de gérer des cartes mémoire. Les fonctionnalités principales incluent l'ajout, la modification, la suppression, et l'affichage des cartes mémoire. Cette application utilise un serveur JSON pour simuler une API RESTful pour les opérations CRUD (Create, Read, Update, Delete) sur les cartes mémoire.

## Structure du projet

L'application est structurée de manière modulaire pour faciliter la maintenance et l'évolutivité. 

### Services

Les services sont utilisés pour encapsuler la logique métier et les appels HTTP. Le service `AuthService` est responsable de l'authentification des utilisateurs, tandis que `MemoryCardService` gère toutes les opérations CRUD sur les cartes mémoire.

### Composants

Les composants sont utilisés pour gérer l'interface utilisateur. Chaque composant est responsable d'une fonctionnalité spécifique :
- **CardComponent** : Affiche les cartes mémoire
- **LoginComponent** : Gère le formulaire de connexion et l'authentification des utilisateurs.
- **HomeComponent** : Affiche la liste des cartes mémoire disponibles et fournit des fonctionnalités d'ajout, de modification, de suppression et de filtrage des cartes.

### Interfaces
Les interfaces sont utilisées pour définir les structures de données dans l'application. Elles permettent d'assurer un typage strict et cohérent dans toute l'application, facilitant ainsi la gestion des données et la communication entre les composants et les services.

- **ColumnInterface** : Définit la structure d'une colonne, utilisée pour organiser les cartes mémoire.
- **MemoryCardInterface** : Définit la structure d'une carte mémoire, incluant des propriétés comme la question, la réponse, la description, le tag, et la colonne associée.

## Principaux choix techniques

### Utilisation de `isLoggedIn` pour la Gestion de l'État de Connexion

La méthode `isLoggedIn` du service d'authentification est utilisée pour vérifier si un utilisateur est connecté. Cette méthode renvoie un `Observable<boolean>`, ce qui permet une gestion réactive de l'état de connexion et l'exécution d'actions spécifiques en fonction de cet état (par exemple, rediriger un utilisateur non connecté vers la page de connexion).

#### Fonctionnement de `isLoggedIn` et `login` dans le Service d'Authentification

1. La méthode `login` :
- Accepte les informations d'identification de l'utilisateur sous la forme d'un objet `{ username: string, password: string }`.
- Envoie une requête POST au serveur avec ces informations.
- Si la connexion est réussie, elle met à jour un `BehaviorSubject` appelé `loggedIn` qui stocke l'état de connexion.
- Renvoie un `Observable<boolean>` qui émet true si la connexion est réussie, et false en cas d'échec.

```typescript
login(credentials: { username: string; password: string }): Observable<boolean> {
  return this.http.post<{ success: boolean }>(this.apiUrl, credentials)
    .pipe(
      map(response => {
        this.loggedIn.next(response.success); // Mise à jour de l'état de connexion
        return response.success;
      }),
      catchError(() => of(false)) // Renvoie `false` en cas d'erreur
    );
}
```

2. La méthode `logout` :
- Réinitialise l'état de connexion à false via le `BehaviorSubject`.

```typescript
logout(): void {
  this.loggedIn.next(false); // Mise à jour de l'état de connexion à déconnecté
}
```

3. La méthode `isLoggedIn` :
- Renvoie un observable à partir du `BehaviorSubject` qui contient l'état actuel de la connexion (`true` ou `false`).
- Ce `BehaviorSubject` permet de surveiller les changements d'état de connexion en temps réel dans différents composants.

```typescript
isLoggedIn(): Observable<boolean> {
  return this.loggedIn.asObservable(); // Retourne l'état de connexion
}
```

#### Exemple dans HomeComponent

Dans le composant de la page d'accueil, `isLoggedIn` est utilisé pour vérifier si l'utilisateur est connecté avant d'afficher le contenu. Si l'utilisateur n'est pas connecté, il est immédiatement redirigé vers la page de connexion pour éviter un accès non autorisé.

```typescript
ngOnInit(): void {
  this.checkUserLoginStatus();
  this.loadMemoryCards();
  this.initializeForm();
}

checkUserLoginStatus(): void {
  this.authService.isLoggedIn().subscribe({
    next: (isLoggedIn) => {
      if (!isLoggedIn) {
        this.router.navigate(['/login']);
      }
    },
    error: (error) => console.error('Erreur de vérification:', error)
  });
}
```

#### Utilisation de server.js avec Route Personnalisée

Dans ce projet, nous utilisons `server.js` pour configurer un serveur JSON simulé avec une route d'authentification personnalisée. Contrairement à une configuration JSON Server standard, qui expose directement les données du fichier JSON via une API RESTful, `server.js` permet de définir des comportements spécifiques comme la gestion de l'authentification des utilisateurs.

- **Pourquoi ne pas utiliser seulement JSON Server** : JSON Server fournit des routes RESTful basiques pour manipuler les données stockées dans un fichier JSON. Cependant, il ne permet pas de personnaliser la logique de traitement des requêtes, comme vérifier les informations d'identification d'un utilisateur ou gérer des opérations spécifiques comme l'authentification.

- **Route personnalisée dans `server.js`** : Le code dans `server.js` ajoute une route `auth` qui permet de vérifier les informations de connexion d'un utilisateur en utilisant les données du fichier `db.json`. Cette route simule le comportement d'un serveur d'authentification en recherchant les informations d'identification fournies et en renvoyant un résultat basé sur cette vérification.

```javascript
server.post('/auth', (req, res) => {
  const { username, password } = req.body;
  const user = router.db.get('users').find({ username, password }).value();

  if (user) {
    res.jsonp({ success: true });
  } else {
    res.jsonp({ success: false });
  }
});
```
Cette configuration permet d'intégrer des fonctionnalités spécifiques aux besoins de l'application tout en utilisant un serveur JSON pour simuler des réponses d'API.

### Validation Conditionnelle avec un Binding de Validator Personnalisé

Dans Angular, un validator personnalisé est souvent utilisé pour appliquer des règles de validation spécifiques aux champs d'un formulaire. Dans notre projet, le `tagValidator` est un validateur personnalisé qui vérifie si le champ `tag` est requis en fonction de la valeur du champ `newTag`. Si `newTag` est vide et `tag` est également vide, une erreur de validation est retournée.

#### Validator personnalisé

```typescript
tagValidator(control: any): { [key: string]: any } | null {
  if (!this.newCardForm) {
    return null;
  }
  const newTag = this.newCardForm.get('newTag')?.value;
  const tag = control.value;
  
  if (!newTag && !tag) {
    return { required: true }; // Tag est requis si aucun nouveau tag n'est saisi
  }
  return null;
}
```

#### Binding du Validator : 

Lors de la création du formulaire dans `initializeForm`, le `tagValidator` est lié au champ `tag` :

```typescript
this.newCardForm = this.fb.group({
  question: ['', Validators.required],
  answer: ['', Validators.required],
  description: [''],
  tag: ['', this.tagValidator.bind(this)],
  newTag: [''],
  column: ['']
});
```

#### Réactivation des Validateurs :

La ligne suivante assure que les validateurs sont réactivés chaque fois que la valeur de `newTag` change :

```typescript
this.newCardForm.get('newTag')?.valueChanges.subscribe(() => {
  this.newCardForm.get('tag')?.updateValueAndValidity();
});
```

Cela signifie que si l'utilisateur modifie la valeur de `newTag`, la validation du champ `tag` sera réévaluée en fonction de la nouvelle valeur de `newTag`. La méthode `updateValueAndValidity` force la réévaluation du validateur, assurant que les règles de validation sont toujours respectées en temps réel.

### Utilisation de `$event.stopPropagation()` pour le Contrôle des Événements

Dans les applications Angular, il est courant d'utiliser des événements pour gérer les interactions utilisateur. Cependant, lorsque plusieurs éléments interactifs sont imbriqués, comme des boutons dans une carte mémoire, les événements peuvent se propager aux éléments parents, entraînant des comportements non souhaités. 

Dans le code ci-dessous, nous avons une carte mémoire avec plusieurs boutons d'action. Le clic sur un bouton déclenche des actions spécifiques comme éditer, supprimer, ou naviguer. Cependant, nous voulons que ces actions soient exécutées sans que le clic n'affecte le comportement de la carte entière.

```html
<div class="card" (click)="toggle()">
    <div class="card-body">
      <span class="badge bg-dark mb-2">{{ card.tag }}</span>
      <h5 class="card-title fs-6">{{ card.question }}</h5>
      <p class="card-text" *ngIf="expanded"><strong>Réponse:</strong> {{ card.answer }}</p>
      <p class="card-text" *ngIf="expanded"><small class="text-muted">{{ card.description }}</small></p>
      
      <!-- Ensemble de boutons d'action -->
      <div class="d-flex align-items-center mt-2">
        <button type="button" class="btn btn-sm me-2" (click)="onLeftArrow(); $event.stopPropagation()">
          <span class="triangle-left"></span>
        </button>
        <button type="button" class="btn btn-primary btn-sm me-2" (click)="onEdit(); $event.stopPropagation()">Modifier</button>
        <button type="button" class="btn btn-danger btn-sm me-2" (click)="onDelete(); $event.stopPropagation()">X</button>
        <button type="button" class="btn btn-sm" (click)="onRightArrow(); $event.stopPropagation()">
          <span class="triangle-right"></span>
        </button>
      </div>
    </div>
</div>
```

La méthode `$event.stopPropagation()` est utilisée ici pour empêcher que le clic sur les boutons d'action (comme "Modifier", "Supprimer", etc.) ne se propage à l'élément parent, qui est la carte elle-même. En d'autres termes, cette méthode arrête l'événement de clic de remonter au conteneur parent (`.card`), où il pourrait déclencher des actions supplémentaires non désirées, comme l'expansion de la carte (`toggle()`).

### Utilisation d'un `tempId` pour Rafraîchir l'Interface sans Attendre la Réponse du Serveur

Lors de l'ajout d'une nouvelle carte dans l'application, il est possible d'améliorer l'expérience utilisateur en **rafraîchissant immédiatement l'interface**, sans attendre la réponse du serveur. Cela se fait en utilisant un **ID temporaire** (`tempId`) pour afficher la nouvelle carte dans la liste avant même que l'opération serveur ne soit terminée.

#### 1. Création de l'ID Temporaire (`tempId`) :

Un **ID temporaire** est généré à l'aide de `Date.now()`, qui renvoie un nombre unique basé sur l'heure actuelle. Ce `tempId` est utilisé pour identifier temporairement la carte mémoire dans l'interface jusqu'à ce que le serveur retourne un vrai ID pour cette carte.

#### 2. Mise à Jour Optimiste de l'Interface :

La carte est immédiatement ajoutée à l'interface utilisateur en utilisant le `tempId`. Cela donne à l'utilisateur une impression instantanée que la carte a été ajoutée, améliorant ainsi la fluidité et la réactivité de l'application. La carte est poussée dans le tableau `memoryCards` avec l'ID temporaire, simulant l'ajout réel de la carte dans l'interface.

```typescript
const tempId = Date.now();
const tempCard = { ...newCard, id: tempId };
this.memoryCards.push(tempCard);
```

#### 3. Appel Asynchrone au Serveur :

En parallèle, l'application fait un **appel asynchrone** au serveur via le service `memoryCardService` pour ajouter la carte réelle dans la base de données.

#### 4. Remplacement de la Carte Temporaire par la Carte Réelle :

Lorsque le serveur retourne la réponse avec la vraie carte (incluant son **ID permanent**), la carte temporaire avec `tempId` est remplacée par la nouvelle carte ayant le vrai ID. Cette substitution se fait en recherchant la carte dans `memoryCards` avec `tempId` et en la remplaçant par la carte renvoyée par le serveur.

```typescript
const index = this.memoryCards.findIndex(c => c.id === tempId);
if (index !== -1) {
  this.memoryCards[index] = addedCard;
}
```

#### 5. Gestion des Erreurs :

Si l'ajout de la carte échoue côté serveur, la carte temporaire est retirée de la liste `memoryCards` pour revenir à un état cohérent. Cela garantit que l'interface utilisateur n'affiche pas des données incorrectes ou des cartes fantômes en cas d'erreur serveur.

```typescript
this.memoryCards = this.memoryCards.filter(c => c.id !== tempId);
```

## Installation et lancement de l'application

### Prérequis

Node.js (version 12 ou supérieure)
Angular CLI (version 12 ou supérieure)

### Étapes d'installation

#### 1. Télécharger et extraire l'archive

Téléchargez l'archive `angularmemorycards.zip` et extrayez-la dans le répertoire de votre choix.

```sh
unzip angularmemorycards.zip
cd angularmemorycards
```

#### 2. Installer les dépendances

Installez les dépendances nécessaires pour l'application Angular et JSON Server.

```sh
npm install
npm install -g json-server
```

### Lancer l'application

#### 1. Démarrer le serveur Node.js

Utilisez Node.js pour démarrer le serveur.

```sh
node server.js
```

#### 2. Démarrer l'application Angular

Utilisez Angular CLI pour démarrer l'application.

```sh
ng serve
```

#### 3. Accéder à l'application

Ouvrez votre navigateur et accédez à l'URL suivante :

```arduino
http://localhost:4200
```

## Conclusion

**Memopus** est une application Angular modulaire pour la gestion de cartes mémoire, conçue pour offrir une interface utilisateur réactive et une expérience fluide. En utilisant Angular, nous avons créé une interface utilisateur réactive et élégante, avec des composants clairement définis pour gérer l'ajout, la modification, et la suppression des cartes mémoire. 

#### **Points clés :**

- **Modularité et Structure** : L'application est organisée de manière modulaire avec des composants spécialisés pour la gestion des cartes mémoire et l'authentification des utilisateurs. Les services comme `MemoryCardService` et `AuthService` centralisent la logique métier et les appels HTTP, facilitant la maintenance et l'évolution de l'application.

- **Formulaires Réactifs** : Grâce au module `ReactiveFormsModule`, les formulaires sont gérés de manière dynamique et valide en temps réel, assurant la cohérence et la précision des données saisies.

- **Gestion des Routes et Observables** : `ActivatedRoute` permet une navigation fluide entre les différentes vues, tandis que l'utilisation d'`Observable` avec `HttpClient` assure une gestion asynchrone efficace des opérations CRUD, offrant une mise à jour en temps réel de l'interface utilisateur.

- **Authentification et Personnalisation du Serveur** : Le serveur JSON configuré via `server.js` avec une route d'authentification personnalisée permet de gérer les informations de connexion des utilisateurs, contrairement à une configuration JSON Server standard, qui ne permet pas de personnaliser la logique des requêtes.

- **Validation Conditionnelle** : Les validateurs personnalisés, comme `tagValidator`, assurent une validation dynamique et contextuelle des formulaires, garantissant que les règles spécifiques sont respectées en temps réel.

- **Gestion des Événements et Optimisation de l'Interface** : L'utilisation de `$event.stopPropagation()` permet un contrôle précis des événements dans l'interface utilisateur, tandis que l'ID temporaire (`tempId`) améliore la réactivité de l'application en affichant immédiatement les cartes ajoutées, avant même la confirmation du serveur.

Cette architecture modulaire et ces choix techniques permettent à **Memopus** d'être à la fois puissant et flexible, offrant une base solide pour la gestion des cartes mémoire avec une interface utilisateur optimisée et une gestion efficace des données. 
