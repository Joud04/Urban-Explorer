// Voici la structure exacte des données envoyées par l'API de Paris
export interface LieuCulturel {
  nom_usuel: string;
  adresse: string;
  coordonnees_geo: {
    lat: number;
    lon: number;
  };
}