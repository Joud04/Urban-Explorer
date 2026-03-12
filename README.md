# Urban Explorer - TP Final React Native

## Description du Projet
"Urban Explorer" est une application mobile de type City Guide développée en React Native (Expo) avec TypeScript. Elle permet de découvrir des événements et lieux culturels parisiens, de les visualiser sur une carte, de planifier une visite via un calendrier et de prendre un selfie souvenir.

---

## 1. Architecture Globale de l'Application

![Architecture du Projet](https://www.plantuml.com/plantuml/proxy?cache=no&src=https://raw.githubusercontent.com/Joud04/Urban-Explorer/main/architecture.puml)

L'application a été structurée selon les standards de l'industrie pour séparer proprement la logique de l'interface visuelle :
* **Découpage des composants :**
  * `/screens` : Contient les vues principales de l'application (Discovery, Map, Profile).
  * `/components` : Contient les composants réutilisables, comme `LieuCard.tsx` qui gère l'affichage stylisé (Flexbox) d'un lieu individuel.
  * `/navigation` : Centralise le routage avec `AppNavigator.tsx`.
  * `types.ts` : Définit les interfaces TypeScript (ex: `LieuCulturel`) pour garantir la sécurité et le typage fort des données.
* **Choix de Navigation :**
  La navigation principale s'appuie sur un `Bottom Tab Navigator`. Pour l'affichage des détails d'un lieu (qui contient le calendrier), j'ai opté pour une approche par **Modal native** superposée à l'écran de découverte. Cela évite d'alourdir la pile de navigation (Stack), prévient les conflits d'en-tête natifs sur Expo Go, et offre une excellente expérience utilisateur (UX) avec une animation fluide.

---

## 2. Intégration de l'API (Open Data Paris)
* **Gestion des requêtes :** L'application consomme l'API via la méthode native `fetch` de manière asynchrone (`async/await`). L'appel est déclenché automatiquement au montage de l'écran `DiscoveryScreen` grâce au Hook `useEffect`.
* **État des données (State) :** Les résultats sont stockés dans le state local via `useState` (`lieux`). Un state `loading` gère l'affichage conditionnel d'un indicateur de chargement (`ActivityIndicator`) pendant la requête réseau.
* **Le challenge de l'API (Adaptation) :** Le dataset initialement demandé (`lieux-culturels-a-paris`) renvoyait une erreur `NotFoundResource` (base supprimée par la Mairie de Paris). J'ai fait preuve d'adaptabilité en connectant l'application au dataset mis à jour `que-faire-a-paris-`. J'ai adapté la structure de l'interface TypeScript pour faire correspondre les nouveaux champs (ex: `title` et `lat_lon`) avec le modèle attendu.

---

## 3. Implémentation des Composants Natifs

### A. La Caméra (`expo-image-picker`)
* **Implémentation :** Prise de selfie depuis l'onglet Profil avec affichage conditionnel de l'avatar.
* **Permissions demandées :** Appel strict à `requestCameraPermissionsAsync()`. Si l'utilisateur refuse, une `Alert` native explique pourquoi l'accès est requis, évitant un blocage silencieux.

### B. Le Calendrier (`react-native-calendars`)
* **Implémentation :** Intégré dans la Modal de détails de l'écran Découverte. 
* **Gestion :** L'événement `onDayPress` met à jour un state `selectedDate`. Un rendu conditionnel affiche ensuite une bannière de confirmation avec la date choisie.

### C. La Carte (`react-native-maps`)
* **Implémentation :** MapView en plein écran centrée sur Paris (Latitude: 48.8566, Longitude: 2.3522). Utilisation de la méthode `.map()` pour générer dynamiquement des composants `<Marker>`.
* **Solution apportée :** Ajout d'une condition de sécurité pour ignorer le rendu d'un marqueur si l'API renvoie un lieu sans coordonnées GPS valides (ex: `lat_lon` manquant), évitant ainsi le crash de l'application.

---

## 4. Installation et Exécution
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

⚠️ Note de dépannage : Si le tunnel Expo plante (erreur ngrok tunnel took too long ou reading 'body'), forcez le nettoyage du cache et la mise à jour de l'outil avec ces commandes :

```bash
npm cache clean --force
npm install -g @expo/ngrok@latest
```

**5. Lancer l'application (en vidant le cache pour éviter les bugs) :**

```bash
npx expo start -c --tunnel
```
---

## 5. Difficultés Rencontrées et Résolution des Bugs (Troubleshooting)
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

## 6. Fonctionnalités Validées
[x] Navigation : Bottom Tab Navigator fonctionnel.

[x] API : Récupération asynchrone (fetch) des données de la Ville de Paris.

[x] UI : Affichage en FlatList avec un style Flexbox propre et moderne.

[x] Carte Native : Intégration de react-native-maps, centrage sur Paris et affichage dynamique des marqueurs (Markers) basés sur les coordonnées de l'API.

[x] Calendrier : Utilisation de react-native-calendars au sein d'une Modal pour sélectionner une date, avec retour visuel (State).

[x] Appareil Photo : Implémentation de expo-image-picker pour la prise de selfie, gestion des permissions et affichage conditionnel de l'avatar.

[x] (Bonus) Stockage Local : Sauvegarde persistante de la photo de profil et des dates de visites avec @react-native-async-storage/async-storage.

[x] (Bonus) Géolocalisation : Intégration de expo-location pour la gestion du positionnement.

[x] (Bonus) Recherche : Barre de recherche dynamique avec filtrage de la liste en temps réel.

[x] (Bonus) Animations Natives : Apparition en fondu (Fade-In) des cartes et animation de respiration (Pulse) sur le bouton de l'appareil photo.
