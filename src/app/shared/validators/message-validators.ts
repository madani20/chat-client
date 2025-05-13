import { AbstractControl, ValidatorFn } from '@angular/forms';

export class CustomValidators {

  static validMessageContent(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const content = control.value;
      
      if (!content) {
        return null; // Laissez Validators.required gérer ce cas
      }

      // Vérification de la longueur
      if (content.length < 1 || content.length > 1000) {
        return { 'invalidLength': true };
      }

      // Vérification du contenu avec une regex
      const validContentRegex = /^[a-zA-Z0-9\s.,!?]*$/;
      if (!validContentRegex.test(content)) {
        return { 'invalidCharacters': true };
      }

      // Vérification de sécurité basique (exemple simplifié)
      const sanitizedContent = content.replace(/[<>&"']/g, '');
      if (sanitizedContent !== content) {
        return { 'unsafeContent': true };
      }

      return null;
    };
  }

  static isValidTimestamp(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const timestamp = control.value;
      const now = new Date().getTime();
      const fiveMinutesAgo = now - 5 * 60 * 1000;
      
      if (timestamp < fiveMinutesAgo || timestamp > now) {
        return { 'invalidTimestamp': true };
      }
      
      return null;
    };
  }

  // Autres validators personnalisés...
}
