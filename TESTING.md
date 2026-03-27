# Tests Automatisés - LA CASA DE POULET

Cette suite de tests vise à garantir la qualité et la stabilité du menu digital sans modifier le site en production.

## 🎯 Objectifs

- ✅ **Validation des données** : menu.json, manifest.json
- ✅ **Intégrité structurelle** : HTML, accessibilité de base
- ✅ **Logique métier** : calculs panier, total, formatage
- ✅ **Persistance** : localStorage (panier, historique)
- ✅ **Non-régression** : éviter les cassures lors de modifications

## 📦 Installation

```bash
npm install
```

Jest est déjà configuré en `devDependency`.

## 🧪 Exécution des Tests

```bash
# Une fois
npm test

# Mode watch (re-run automatiquement sur changements)
npm run test:watch

# Avec couverture de code
npm test -- --coverage
```

## 📁 Structure des Tests

```
tests/
├── casa-de-poulet.test.js     # Tests principaux (menu, calculs)
├── manifest.test.js           # Validation PWA manifest
├── html-structure.test.js     # Structure HTML de base
├── localStorage.test.js       # Persistance panier/historique
└── (futurs tests...)
```

## 🔍 Ce qui est testé

### 1. Menu Data (`casa-de-poulet.test.js`)
- ✅ Parsing JSON valide
- ✅ Chaque catégorie a `label`, `emoji`, `items[]`
- ✅ Chaque item a `id`, `name`, et au moins un champ prix valide
- ✅ Prix entre 6 dh et 200 dh
- ✅ Pas d'IDs en double
- ✅ Structures spécifiques (Pizza size prices, Plat options, badges)
- ✅ Support bilingue FR/AR

### 2. Calculs Panier
- ✅ Total panier vide = 0
- ✅ Multiplication quantité × prix
- ✅ Somme de plusieurs articles
- ✅ Gestion des articles optionnels (priceP/priceM)

### 3. PWA Manifest
- ✅ Nom, short_name, description
- ✅ start_url, display, theme_color
- ✅ Icônes complètes (72 à 512px)
- ✅ Présence des fichiers d'icônes dans `/icons`
- ✅ Catégories "food", "shopping"

### 4. HTML Structure
- ✅ DOCTYPE, lang="fr", viewport
- ✅ Header, navigation, main, bottom-bar (panier)
- ✅ Modals (commande, admin, historique)
- ✅ Form fields (name, phone, modes, table, GPS, address...)
- ✅ ARIA labels et roles (accessibilité de base)

### 5. LocalStorage
- ✅ Sauvegarde/lecture panier
- ✅ Sauvegarde/lecture historique
- ✅ Ajout d'une nouvelle commande à l'historique
- ✅ Suppression d'items (qty=0)
- ✅ Suppression panier complet

## ❌ Ce qui n'est PAS testé (pour l'instant)

- JavaScript runtime en navigateur (DOM manipulation)
- Service Worker registration et stratégies de cache
- Envoi WhatsApp (redirection externe)
- Responsive design (CSS)
- Performance metrics
- Internationalisation dynamique (toggle FR/AR)
- Authentification admin (connexion/déconnexion)

## 🔐 Sécurité Administration

### Authentification par mot de passe

L'accès à l'administration du menu est maintenant protégé par mot de passe.

**Accès :**
1. Ajouter `?admin=1` à l'URL (ex: `https://casa-de-poulet.vercel.app/?admin=1`)
2. Cliquer sur le bouton ⚙️ qui apparaît dans la barre supérieure
3. Entrer le mot de passe administrateur
4. Le modal d'édition du menu s'ouvre

**Session :**
- La session dure 1 heure (stockée en `sessionStorage`)
- Possibilité de se déconnecter via le bouton 🚪 dans le modal admin
- Session automatiquement invalidée après expiration

**Mot de passe par défaut :**
```
CasaDePouletAdmin2025!
```
⚠️ **Changez-le immédiatement après le premier déploiement !** Pour changer le mot de passe, éditez le fichier `script.96986dcf.js` et mettez à jour le champ `ADMIN_CONFIG.passwordHash`. Générez un nouveau hash avec :
```bash
node -e "console.log(require('crypto').createHash('sha256').update('VOTRE_NOUVEAU_MOT_DE_PASSE').digest('hex'))"
```

**Note :** Le hash SHA-256 est stocké côté client. Cela n'offre pas une sécurité militaire, mais protège contre les accès accidentels et les bots simples. Pour une vraie sécurité, une authentification backend est recommandée.

### Fichiers modifiés

- `index.html` : ajout du bouton admin caché et du modal de connexion
- `script.96986dcf.js` : logique d'authentification, session management, hash verification

## 🚀 Ajouter un Nouveau Test

1. Créer un fichier `tests/mon-fonctionnalite.test.js`
2. Importer les modules nécessaires :
   ```js
   const fs = require('fs');
   const path = require('path');
   const menuData = JSON.parse(fs.readFileSync(path.join(__dirname, '../menu.json'), 'utf8'));
   ```
3. Utiliser `describe()` et `test()` ou `it()`
4. Exécuter `npm test`

## 📊 Couverture de Code

Pour voir quels fichiers/lignes sont couverts :

```bash
npm test -- --coverage --collectCoverageFrom='["script.96986dcf.js"]'
```

⚠️ Note : Le fichier JS principal est minifié, la couverture peut être imprécise.

## 🐛 Rapports de Bugs

Si un test échoue :
1. Vérifier que `menu.json` est valide (pas de syntaxe JSON cassée)
2. Vérifier que les fichiers d'icônes existent dans `/icons`
3. Vérifier que `index.html` contient les éléments requis

## 🎨 Bonnes Pratiques

- Tester une seule chose par test
- Utiliser des `describe()` pour regrouper les tests liés
- Nommer clairement les tests : "doit faire X quand Y"
- Ne pas modifier le code de production dans les tests
- Mocker les dépendances externes (localStorage, fetch, etc.)

## 📚 Ressources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Best Practices](https://jestjs.io/docs/best-practices)

## 🛠️ CI/CD Intégration (futur)

Ajouter dans `package.json` :

```json
{
  "scripts": {
    "test": "jest",
    "test:ci": "jest --ci --coverage --maxWorkers=2"
  }
}
```

## ✅ Validation Continue

Les tests doivent passer à tout moment. Un build/commit qui casse les tests doit être corrigé immédiatement.

---

**Dernière mise à jour :** 27 mars 2025
**Nombre de tests :** 78 (cible > 100)
