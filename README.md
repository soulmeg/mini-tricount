# Mini-tricount

Une application de partage de dépenses en groupe, inspirée de Tricount.  
Stack : React · Express · SQLite

---

## Lancer le projet

### Prérequis

- Node.js 18+
- Aucune installation de base de données requise

### Backend

```bash
cd backend
npm install
node src/db/migrate.js
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

L'app est accessible sur `http://localhost:5173`

---

## Choix techniques

### Architecture backend

J'ai séparé le code en trois couches : **routes** (endpoints uniquement), **controllers** (validation + orchestration), **models** (logique BDD). Le settlement a sa propre couche **service** car c'est de la logique métier pure, indépendante de la base de données.

### Algorithme de règlement — greedy

L'objectif est de minimiser le nombre de virements. Mon approche :

1. Calculer le **solde net** de chaque participant (ce qu'il a payé moins ce qu'il doit)
2. Séparer en deux listes : créditeurs (solde > 0) et débiteurs (solde < 0)
3. À chaque tour, faire payer le plus gros débiteur au plus gros créditeur — `Math.min` des deux montants
4. Répéter jusqu'à ce que tout soit soldé

Exemple avec Alice (paie 90€), Bob (paie 30€), Claire (ne paie rien) pour un week-end à 3 :

- Soldes : Alice +50, Bob -10, Claire -40
- Résultat : Claire → Alice 40€, Bob → Alice 10€ → **2 virements** au lieu de 3

L'algorithme greedy donne le minimum de virements dans la grande majorité des cas. Il n'est pas garanti optimal dans tous les cas extrêmes, mais pour des groupes humains de taille raisonnable il est parfait.

### Base de données — SQLite

J'ai développé initialement avec PostgreSQL en local. Pour faciliter les tests sans obliger à installer un serveur de base de données, j'ai switché vers **SQLite** via `better-sqlite3` — même syntaxe SQL, même architecture, juste le client qui change. Les données sont persistées dans un fichier local `tricount.db` créé automatiquement à la migration.

4 tables : `groups`, `participants`, `expenses`, `expense_shares`. La table `expense_shares` stocke la part de chaque participant pour chaque dépense — ça permet de gérer finement qui participe à quoi et prépare la gestion des dépenses inégales.

### Frontend

React avec Vite pour la rapidité de setup. Tailwind pour le style — pas de composants externes, tout est fait à la main. React Router pour la navigation entre la page d'accueil et la page de groupe.

---

## Ce que je n'ai pas eu le temps de faire

**Gestion des dépenses inégales** — la table `expense_shares` est déjà prévue pour ça (chaque participant a sa propre `share_amount`), mais l'interface ne permet pas encore de définir des parts différentes par personne. Avec plus de temps j'aurais ajouté un mode "montants personnalisés" dans le formulaire d'ajout de dépense.

**Mini-feature IA** — j'aurais voulu ajouter un champ "décris ta dépense en langage naturel" qui pré-remplit automatiquement le formulaire (libellé, montant, participants) via l'API OpenAI ou claude code.

---

## Ce que je changerais avec Next.js et FastAPI

Je n'ai pas encore beaucoup utilisé ces deux technologies mais voici ce que
j'ai compris de leurs avantages pour ce projet.

**Next.js** — le SSR (Server Side Rendering) permettrait de charger la liste des groupes
côté serveur, évitant le flash de chargement actuel avec useEffect.

**FastAPI** — la validation automatique des requêtes via une librairie (pydantic) remplacerait mes vérifications manuelles dans les controllers.

---

## Ce que j'aurais fait différemment avec plus de temps

- Ajouter des tests unitaires sur l'algorithme de settlement — c'est la partie la plus critique
- Gérer les erreurs côté frontend avec des toasts plutôt que des `alert()`

---

## Ce que j'ai essayé qui n'a pas marché

### Première approche du settlement — remboursement dépense par dépense

Ma première idée était de traiter chaque dépense indépendamment : pour chaque dépense, chaque participant rembourse sa part directement au payeur. L'implémentation était simple mais le résultat était mauvais sur un groupe de 6 personnes avec 7 dépenses on pouvait se retrouver avec 20+ virements alors que 5 suffisent.

### Pourquoi j'ai choisi cette approche

J'ai cherché comment faire le moins de virements possible.
L'idée c'est de ne pas raisonner dépense par dépense, mais de
calculer un solde global pour chaque personne — ce qu'elle a payé
moins ce qu'elle devait payer.

Ensuite je règle toujours la plus grosse dette en premier. Comme ça
à chaque virement au moins une personne est complètement soldée, ce
qui garantit un nombre minimal de transactions.

C'est simple, rapide, et c'est l'approche utilisée par Tricount lui-même.
