<p align="center">
  <br />
  <h1 align="center">🎵 HMIS Backend API</h1>
  <strong>Hankes Music Intelligence System - Core Infrastructure</strong>
  <br />
</p>

## 📖 Description
L'API Backend du système HMIS (Hankes Music Intelligence System) gère le traitement des captures audio en temps réel pour l'identification musicale dans des établissements tels que les bars, les boîtes de nuit et les hôtels. 

L’outil est conçu pour extraire les analytiques d'écoutes selon la demande des partenaires étatiques (ex: BURIDA) tout en assurant une sécurité sans faille via NestJS, des jetons JWT fractionnés, et une protection CORS + Rate Limit stricte.

## ⚙️ Stack Technologique
* **Framework :** [NestJS](https://nestjs.com/) (TypeScript)
* **Base de Données :** [MongoDB Atlas](https://www.mongodb.com/atlas/database)
* **ORM :** [Prisma (v6)](https://www.prisma.io/)
* **Authentification :** JWT / Passport
* **Validation des Payloads :** Class-Validator / Class-Transformer
* **Sécurité Additionnelle :** Helmet, Express Multer, ThrottlerModule

---

## 🛠️ Installation & Démarrage

### 1. Cloner & Préparer les Dépendances
Rendez-vous à la racine du dossier API (`hmi-api`) :
```bash
$ npm install
```

**⚠️ Attention Spéciale (Prisma & MongoDB) :**  
Puisque le projet utilise MongoDB, assurez-vous de figer les versions compatibles de Prisma pour éviter les instabilités du moteur (Prisma 7.x ne supportant plus temporairement Mongo).
```bash
$ npm install prisma@6 @prisma/client@6
```

### 2. Formater votre `.env`
Créez un fichier `.env` à la base du projet (à côté de `package.json`) et remplissez-le ainsi :

```env
# URL De Connexion MongoDB Atlas - Remplacez <user> et <password>
DATABASE_URL="mongodb+srv://<votre_utilisateur>:<votre_mot_de_passe>@cluster0.qqxypj8.mongodb.net/hmis_db?retryWrites=true&w=majority"

# Clé Secrète pour l'Authentification JWT
JWT_SECRET="MonSuperMotDePasseSecretHmIs2026!"

# Port du Serveur (Défaut: 3000)
PORT=3000
```

### 3. Synchronisation de la Base de Données
Une fois votre `.env` défini, synchronisez la structure de votre backend NestJS sur votre cluster MongoDB Atlas :
```bash
# Générer le lient de typage de Prisma :
$ npx prisma generate

# Pousser les modèles sur Atlas :
$ npx prisma db push
```

### 4. Lancer le Serveur (Development)
```bash
$ npm run start:dev
```
Vos requêtes peuvent dorénavant être testées sur `http://localhost:3000/v1/...`

---

## 📂 Architecture des Modules

Le code source a une structure modulaire stricte injectée dynamiquement dans le `AppModule`.

| Module | Description & Rôle |
| ------ | ----------- |
| **`AuthModule`** | Distribution des JWT, Inscription/Login, Envoi et Vérification d'OTPs, Routage des RBAC (`@Roles()`). |
| **`UtilisateursModule`** | Opérations CRUD, Pagination et filtrages par rôles sur la table `Utilisateur`. Interception `CurrentUser()`. |
| **`EtablissementsModule`** | Logique de validation d'activités, suspension ou approbation pour les hôtels et bars partenaires. |
| **`AudioModule`** | Entrée sécurisée Multipart-form limitant le poids à `512 Ko`. Contient l'intelligence d'indexation locale hors-ligne / en-ligne ! |
| **`DiffusionsModule`** | Stockage analytique liant un `Etablissement` et un titre identifié via ACRCloud / AudD. |
| **`DashboardModule`** | Récolte de Statistiques (Top titres de la journée, écoutes globales, métriques en temps réel). |
| **`ReportingModule`** | Module chargé des exports administratifs CSV / JSON sur demande pour la BURIDA. |

---

## 🛡️ Rôles & Sécurité
Les endpoints sont protégés sous plusieurs couches via d'exigeantes défenses NestJS. L’Accès global est limité par **Rate Limiting** avec un seuil de saturation sur des connexions abusives.

Les rôles d'utilisateurs (`admin`, `etablissement`, `partenaire`) sont appliqués dynamiquement en en-tête des Contrôleurs :
```typescript
@Roles(Role.admin) // Seul un administrateur HMIS accède à la ressource
@Get('statistiques')
```

## 📬 Contact & Maintenances
Ce système représente le squelette dynamique HMIS sur Node.JS 
**Statut actuel :** `Prêt pour la production (Phase Alpha)`
