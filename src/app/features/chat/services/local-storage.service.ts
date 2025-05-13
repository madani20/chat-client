import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  /**
   * Enregistre une valeur dans le stockage local
   * @param key La clé sous laquelle la valeur sera stockée
   * @param value La valeur à stocker
   */
  setItem(key: string, value: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(value))
     // console.log('LocalStorageService: setItem', key, value)
    } catch (e) {
      console.error('Erreur de stockage local', e);
    }
  }

  /**
   * Récupère une valeur du stockage local
   * @param key La clé de la valeur à récupérer
   * @returns La valeur récupérée ou null si elle n'existe pas
   */   
  getItem<T>(key: string): T | null {
    let data: string | null = null;
    try {
      data = localStorage.getItem(key)
      //console.log('LocalStorageService: getItem', key, data)
     // console.log(`Lecture de localStorage pour la clé "${key}":`, data); // Log avant parsing
      return data ? JSON.parse(data.trim()) : null;
    } catch (e) {
      //console.error(`Erreur de lecture locale pour la clé "${key}", valeur: "${data}"`, e);
      return null;
    }
  }
  /**
   * Nettoie le stockage local
   */
  clear(): void {
    try {
      localStorage.clear();
    } catch (e) {
      console.error('Erreur de nettoyage du stockage local', e);
    }
  }
  /**
   * Supprime une valeur du stockage local
   * @param key La clé de la valeur à supprimer
   */
  removeItem(key: string): void {
    try {
      localStorage.removeItem(key)
      //console.log('LocalStorageService: removeItem', key)
    } catch (e) {
      console.error('Erreur de suppression du stockage local', e);
    }
  }

  /**
   * Vérifie si une clé existe dans le stockage local
   * @param key La clé à vérifier
   * @returns true si la clé existe, sinon false
   */
  hasKey(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }
}
