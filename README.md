# Tricount — Test technique The Next Mind

Une application de partage de dépenses en groupe, inspirée de Tricount.  
Stack : React, Express, PostgreSQL

---

## Lancer le projet

### Prérequis

- Node.js 18+
- PostgreSQL installé et démarré

### Backend

```bash
cd backend
npm install
```

Crée un fichier `.env` dans `backend/` :

```env
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_NAME=tricount
DB_USER=ton_user
DB_PASSWORD=ton_mot_de_passe
```

Crée la base de données puis lance les migrations :

```bash
psql -U ton_user -c "CREATE DATABASE tricount;"
node src/db/migrate.js
```

Lance le serveur :

```bash
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

L'algorithme greedy donne le minimum de virements dans la grande majorité des cas. Il n'est pas garanti optimal dans tous les cas extrêmes (c'est un problème NP-difficile), mais pour des groupes humains de taille raisonnable il est parfait.

### Base de données

4 tables : `groups`, `participants`, `expenses`, `expense_shares`. La table `expense_shares` stocke la part de chaque participant pour chaque dépense., ça permet de gérer finement qui participe à quoi et prépare la gestion des dépenses inégales.

Les suppressions sont en cascade (`ON DELETE CASCADE`) : supprimer un groupe supprime tout ce qui lui est lié.

### Frontend

React avec Vite pour la rapidité de setup. Tailwind pour le style — pas de composants externes, tout est fait à la main. React Router pour la navigation entre la page d'accueil et la page de groupe.

---

## Ce que je n'ai pas eu le temps de faire

**Persistance côté client** — les données sont en base PostgreSQL donc persistées, mais il n'y a pas de cache local ou d'optimistic update. Chaque action recharge les données depuis l'API.

**Gestion des dépenses inégales** — la table `expense_shares` est déjà prévue pour ça (chaque participant a sa propre `share_amount`), mais l'interface ne permet pas encore de définir des parts différentes par personne. Avec plus de temps j'aurais ajouté un mode "montants personnalisés" dans le formulaire d'ajout de dépense.

**Mini-feature IA** — j'aurais voulu ajouter un champ "décris ta dépense en langage naturel" qui pré-remplit automatiquement le formulaire (libellé, montant, participants) via l'API Claude. La structure est prête pour l'intégrer côté backend.

---

## Ce que je changerais avec Next.js et FastAPI

**Next.js** — les pages auraient bénéficié du Server Side Rendering pour le premier chargement, notamment la liste des groupes. Les Server Components auraient permis de faire les appels BDD directement sans passer par une API REST pour certaines pages.

**FastAPI** — typage fort avec Pydantic, validation automatique des requêtes, et la doc Swagger générée automatiquement. L'algorithme de settlement aurait été plus lisible en Python avec des dataclasses typées.

---

## Ce que j'aurais fait différemment avec plus de temps

- Ajouter des tests unitaires sur l'algorithme de settlement — c'est la partie la plus critique
- Gérer les erreurs côté frontend avec des toasts plutôt que des `alert()`
- Ajouter un loader skeleton sur les listes pendant le chargement
- Protéger les routes avec un système d'authentification simple

## Ce que j'ai essayé qui n'a pas marché

### Première approche du settlement — remboursement dépense par dépense

Ma première idée était de traiter chaque dépense indépendamment : pour chaque dépense, chaque participant rembourse sa part directement au payeur. L'implémentation était simple mais le résultat était mauvais sur un groupe de 6 personnes avec 7 dépenses on pouvait se retrouver avec 20+ virements alors que 5 suffisent.

J'ai abandonné cette approche dès que j'ai réalisé qu'elle ignorait complètement les compensations entre dépenses.

<!--
### Deuxième piste — graphe de dettes avec simplification

J'ai réfléchi à modéliser les dettes comme un graphe orienté et à simplifier les cycles — si Alice doit 10€ à Bob et Bob doit 6€ à Alice, on simplifie en une seule dette de 4€. Conceptuellement plus élégant, mais plus complexe à implémenter correctement et ça ne garantissait pas non plus le minimum de virements dans tous les cas. -->

### Pourquoi j'ai choisi greedy

J'ai volontairement écarté la solution vraiment optimale (NP-difficile, type subset sum) car sa complexité explose avec le nombre de participants et n'a aucun sens pour une app de partage entre amis. Le greedy est le meilleur compromis : simple, rapide , explicable en 30 secondes, et optimal dans la grande majorité des cas réels. C'est d'ailleurs l'approche utilisée par Tricount lui-même.
