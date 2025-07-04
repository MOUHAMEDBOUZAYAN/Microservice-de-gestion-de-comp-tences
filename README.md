# Microservice de gestion de compétences

## 📋 Description

Ce projet est une application web fullstack permettant de gérer, suivre et évaluer des compétences et sous-compétences de manière structurée et intuitive. L'application offre une interface utilisateur moderne développée avec React et Tailwind CSS, couplée à une API REST robuste construite avec Node.js, Express et MongoDB.

## ✨ Fonctionnalités principales

- **Gestion des compétences** : Création, modification et suppression de compétences avec codes uniques (C1 à C8)
- **Sous-compétences** : Chaque compétence peut contenir plusieurs sous-compétences avec statut de validation
- **Évaluation automatique** : Calcul automatique du statut d'une compétence selon le nombre de sous-compétences validées
- **Statistiques globales** : Affichage en temps réel des métriques de progression
- **Interface intuitive** : Interface utilisateur moderne avec notifications et feedback utilisateur
- **API REST complète** : Endpoints pour toutes les opérations CRUD

## 🏗️ Architecture

### Structure du projet
```
microservice-competences/
├── Server/          # Backend Node.js/Express
│   ├── models/      # Modèles Mongoose
│   ├── routes/      # Routes API
│   ├── controllers/ # Logique métier
│   └── app.js       # Point d'entrée serveur
└── Client/          # Frontend React
    ├── src/
    │   ├── components/  # Composants React
    │   ├── services/    # Services API
    │   └── App.jsx      # Composant principal
    └── package.json
```

### Architecture client/serveur
- **Frontend** : Application React SPA communiquant avec l'API via Axios
- **Backend** : API REST Node.js/Express avec base de données MongoDB
- **Communication** : Échange de données JSON via HTTP

## 🛠️ Technologies utilisées

### Backend
- **Node.js** - Environnement d'exécution JavaScript
- **Express** - Framework web minimaliste
- **Mongoose** - ODM pour MongoDB
- **Jest** - Framework de tests

### Frontend
- **React** - Bibliothèque JavaScript pour l'interface utilisateur
- **Vite** - Outil de build et serveur de développement
- **Tailwind CSS** - Framework CSS utilitaire
- **Axios** - Client HTTP pour les requêtes API
- **React Toastify** - Notifications utilisateur
- **Lucide React** - Icônes modernes

## 🚀 Installation et lancement

### Prérequis
- Node.js (version 16 ou supérieure)
- npm ou yarn
- MongoDB (local ou distant)

### Instructions d'installation

1. **Cloner le repository**
```bash
git clone <url-du-repo>
cd microservice-competences
```

2. **Installer les dépendances du backend**
```bash
cd Server
npm install
```

3. **Installer les dépendances du frontend**
```bash
cd ../Client
npm install
```

4. **Configuration de la base de données**
   - Assurez-vous que MongoDB est installé et en cours d'exécution
   - Créez une base de données pour le projet (optionnel, elle sera créée automatiquement)

5. **Lancer le backend**
```bash
cd Server
node app.js
# ou avec nodemon pour le développement
npm run dev
```

6. **Lancer le frontend**
```bash
cd Client
npm run dev
```

L'application sera accessible à l'adresse `http://localhost:5173` (frontend) et l'API à `http://localhost:3000` (backend).

## 📚 Documentation API

### Endpoints principaux

#### GET /competences
Récupère la liste de toutes les compétences avec leurs statistiques.

**Réponse :**
```json
{
  "competences": [
    {
      "_id": "64f5a1b2c3d4e5f6a7b8c9d0",
      "code": "C1",
      "nom": "Développement web",
      "sousCompetences": [
        {
          "nom": "HTML/CSS",
          "validee": true
        },
        {
          "nom": "JavaScript",
          "validee": false
        }
      ],
      "statut": "En cours"
    }
  ],
  "statistiques": {
    "total": 8,
    "validees": 3,
    "enCours": 5
  }
}
```

#### GET /competences/:id
Récupère une compétence spécifique par son ID.

**Paramètres :**
- `id` : ID MongoDB de la compétence

**Réponse :**
```json
{
  "_id": "64f5a1b2c3d4e5f6a7b8c9d0",
  "code": "C1",
  "nom": "Développement web",
  "sousCompetences": [
    {
      "nom": "HTML/CSS",
      "validee": true
    }
  ]
}
```

#### POST /competences
Crée une nouvelle compétence.

**Corps de la requête :**
```json
{
  "code": "C9",
  "nom": "Intelligence Artificielle",
  "sousCompetences": [
    {
      "nom": "Machine Learning",
      "validee": false
    },
    {
      "nom": "Deep Learning",
      "validee": false
    }
  ]
}
```

#### PUT /competences/:id/evaluation
Met à jour l'évaluation d'une compétence (statut des sous-compétences).

**Corps de la requête :**
```json
{
  "sousCompetences": [
    {
      "nom": "HTML/CSS",
      "validee": true
    },
    {
      "nom": "JavaScript",
      "validee": true
    }
  ]
}
```

#### DELETE /competences/:id
Supprime une compétence.

**Paramètres :**
- `id` : ID MongoDB de la compétence à supprimer

## 🧩 Composants principaux

### Frontend
- **CompetenceCard** : Affiche une compétence avec ses sous-compétences
- **CompetenceForm** : Formulaire de création/modification de compétences
- **StatCard** : Affiche les statistiques globales
- **LoadingSpinner** : Indicateur de chargement

### Backend
- **Modèle Competence** : Définit la structure des données avec méthodes de calcul de statut
- **Routes API** : Gestion des endpoints REST
- **Controllers** : Logique métier et validation des données

## 🔧 Développement

### Scripts disponibles

#### Backend (Server/)
```bash
npm start        # Démarrage en production
npm run dev      # Démarrage en développement avec nodemon
npm test         # Exécution des tests Jest
```

#### Frontend (Client/)
```bash
npm run dev      # Démarrage du serveur de développement
npm run build    # Build de production
npm run preview  # Aperçu du build de production
npm run lint     # Analyse du code avec ESLint
```

### Structure des données

#### Modèle Competence
```javascript
{
  code: String,           // Code unique (C1, C2, etc.)
  nom: String,            // Nom de la compétence
  sousCompetences: [{
    nom: String,          // Nom de la sous-compétence
    validee: Boolean      // Statut de validation
  }],
  statut: String          // Calculé automatiquement
}
```

## 🤝 Contribution

Nous accueillons favorablement les contributions au projet ! Voici comment procéder :

1. **Fork** le repository
2. **Créer** une branche pour votre fonctionnalité (`git checkout -b feature/nouvelle-fonctionnalite`)
3. **Commit** vos modifications (`git commit -m 'Ajout d'une nouvelle fonctionnalité'`)
4. **Push** vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. **Ouvrir** une Pull Request

### Conventions de code
- Utiliser ESLint pour le formatage du code JavaScript
- Respecter la structure de composants React existante
- Documenter les nouvelles fonctionnalités
- Ajouter des tests pour les nouvelles fonctionnalités backend

### Signalement de bugs
Pour signaler un bug, veuillez créer une issue avec :
- Description détaillée du problème
- Étapes pour reproduire le bug
- Environnement (OS, version Node.js, etc.)
- Captures d'écran si applicable

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

Pour toute question ou assistance, n'hésitez pas à :
- Créer une issue sur GitHub
- Consulter la documentation des technologies utilisées
- Contacter l'équipe de développement

---

## 👨‍💻 Auteur

**Mouhamed Bouzayan**  
Étudiant en développement web - École Numérique Ahmed Al Henssali  
Formation en développement fullstack JavaScript

---

**Développé avec ❤️ par l'équipe de développement**
