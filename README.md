# Urban Explorer - TP Final React Native

## Description du Projet
"Urban Explorer" est une application mobile de type City Guide développée en React Native (Expo) avec TypeScript. Elle permet de découvrir des événements et lieux culturels parisiens, de les visualiser sur une carte, de planifier une visite via un calendrier et de prendre un selfie souvenir.

---

## Installation et Exécution
Pour faire tourner ce projet sur votre machine, veuillez suivre ces commandes étape par étape dans votre terminal :

**1. Installer les dépendances de base du projet :**

```bash
npm i
```

**2. Installer les modules de Navigation et d'Icônes :**

```bash
npm install @react-navigation/bottom-tabs @react-navigation/native-stack
npx expo install @expo/vector-icons
```

**3. Installer les modules Natifs (Calendrier, Caméra, Localisation & Stockage) :**
```bash
npm install react-native-calendars
npx expo install expo-image-picker
npx expo install expo-location
npx expo install @react-native-async-storage/async-storage
```

**4. Outils réseau (si besoin d'un tunnel sécurisé) :**

```bash
npm install -g @expo/ngrok
```

**5. Lancer l'application (en vidant le cache pour éviter les bugs) :**

```bash
npx expo start -c --tunnel
```

---

## Difficultés Rencontrées et Résolution des Bugs (Troubleshooting)
Lors du développement, particulièrement lors de l'Étape 1 (Mise en place de la navigation), plusieurs défis techniques ont été rencontrés et résolus :

### 1. Le Crash Natif iOS/Android ("String cannot be cast to Boolean")
* **Symptôme :** L'application crashait avec un écran rouge (erreur de cast sur Android, erreur de type sur iOS) lors de l'intégration du `Stack Navigator` dans le `Tab Navigator`.
* **Analyse :** Le code TypeScript ne contenait aucune erreur de syntaxe (aucun `"false"` écrit en chaîne de caractères). Le problème provenait d'un conflit de cache corrompu dans l'application Expo Go et d'un bug connu de la bibliothèque native `react-native-screens` lié au masquage conditionnel des en-têtes (`headerShown: false`).
* **Solution :** 1. Nettoyage complet du cache de Metro Bundler (`npx expo start -c`) et suppression du dossier caché `.expo`.
  2. Déplacement de la propriété `headerShown: false` dans les `screenOptions` globales du Tab Navigator pour contourner le bug du moteur natif.

### 2. Contraintes du Typage Strict TypeScript
* **Symptôme :** Erreurs de type `implicitly has an 'any' type` lors de la configuration de la barre de navigation.
* **Analyse :** Le template `blank-typescript` d'Expo impose un mode strict. Les paramètres natifs de React Navigation (`route`, `color`, `size`) n'étaient pas reconnus automatiquement.
* **Solution :** Typage explicite des paramètres de la fonction `tabBarIcon` avec des interfaces locales (`{ route: any }`, `{ color: string; size: number }`) pour garantir la robustesse du code.

### 3. Blocage Réseau avec Expo Tunnel (ngrok)
* **Symptôme :** Erreur `ngrok tunnel took too long to connect`.
* **Analyse :** Le pare-feu du réseau Wi-Fi de l'école (IPSSI) bloquait les services de tunneling externe empêchant la communication entre le PC et le smartphone.
* **Solution :** Mise en place d'un réseau local privé via un partage de connexion 4G/5G mobile, permettant d'utiliser Expo en mode LAN standard de manière beaucoup plus rapide et stable.

### 4. L'Évolution de l'API Open Data de Paris
* **Symptôme :** L'API de la ville de Paris renvoyait l'erreur `NotFoundResource` pour le dataset `lieux-culturels-a-paris`.
* **Analyse :** Vérification des logs de la requête : la Mairie de Paris a supprimé ou renommé ce dataset spécifique.
* **Solution :** Remplacement par le dataset officiel mis à jour (`que-faire-a-paris-`). J'ai adapté la structure de l'interface TypeScript pour faire correspondre les nouveaux champs de l'API (ex: `title` et `lat_lon`) avec le typage `LieuCulturel` initialement prévu.

### 5. L'UX de la page de Détails (Calendrier)
* **Symptôme :** Conflit de navigation pour passer de la liste des lieux à la page de détails (calendrier).
* **Solution :** Conformément aux autorisations du sujet ("ou via une fenêtre Modal"), j'ai opté pour une approche par `Modal` native. Cela évite d'alourdir la pile de navigation (Stack), offre une meilleure expérience utilisateur (animation de glissement) et a permis de stabiliser définitivement l'application.

---

Fonctionnalités Validées
[x] Navigation : Bottom Tab Navigator fonctionnel.

[x] API : Récupération asynchrone (fetch) des données de la Ville de Paris.

[x] UI : Affichage en FlatList avec un style Flexbox propre (Composant LieuCard).

[x] Carte Native : Intégration de react-native-maps, centrage sur Paris et affichage dynamique des marqueurs (Markers) basés sur les coordonnées de l'API.

[x] Calendrier : Utilisation de react-native-calendars au sein d'une Modal pour sélectionner une date, avec retour visuel (State).

[x] Appareil Photo : Implémentation de expo-image-picker pour la prise de selfie, gestion des permissions et affichage conditionnel de l'avatar.

[x] (Bonus) Stockage Local : Sauvegarde persistante de la photo de profil et des dates de visites avec @react-native-async-storage/async-storage.

[x] (Bonus) Géolocalisation : Intégration de expo-location pour la gestion du positionnement.