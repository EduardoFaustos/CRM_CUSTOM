import { Injectable } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Servicio de Validación de Cédulas y RUCs Ecuatorianos
 * Implementa los algoritmos de validación según estándares de SRI (Servicio de Rentas Internas)
 */
@Injectable({
  providedIn: 'root',
})
export class EcuadorianDocumentValidationService {
  /**
   * Valida una cédula ecuatoriana
   *
   * @param cedula - Número de cédula (10 dígitos)
   * @returns Objeto con validez y mensaje
   */
  validateCedula(cedula: string): {
    valid: boolean;
    message: string;
  } {
    // Validar que sea una cadena numérica de 10 dígitos
    if (typeof cedula !== 'string' || !/^\d{10}$/.test(cedula)) {
      return {
        valid: false,
        message: 'Cédula debe contener exactamente 10 dígitos numéricos.',
      };
    }

    // Validar provincia (primeros 2 dígitos, rango 0-24)
    const province = parseInt(cedula.substring(0, 2), 10);
    if (province < 0 || province > 24) {
      return {
        valid: false,
        message: 'Provincia inválida (primeros 2 dígitos fuera de rango 0-24).',
      };
    }

    // Coeficientes para validación de cédula
    const coefficients = [2, 1, 2, 1, 2, 1, 2, 1, 2];
    let sum = 0;

    // Multiplicar cada dígito (excepto el último) por su coeficiente
    for (let i = 0; i < 9; i++) {
      const digit = parseInt(cedula[i], 10);
      let product = digit * coefficients[i];

      // Si el producto es >= 10, restar 9
      if (product >= 10) {
        product -= 9;
      }

      sum += product;
    }

    // Aplicar módulo 10
    const module = sum % 10;

    // Calcular dígito verificador
    let verifier = module === 0 ? 0 : 10 - module;

    // Comparar con el dígito verificador de la cédula
    const lastDigit = parseInt(cedula[9], 10);

    if (verifier === lastDigit) {
      return {
        valid: true,
        message: 'Cédula válida.',
      };
    } else {
      return {
        valid: false,
        message: 'Cédula inválida: Dígito verificador no coincide.',
      };
    }
  }

  /**
   * Valida un RUC ecuatoriano
   *
   * @param ruc - Número de RUC (13 dígitos)
   * @returns Objeto con validez y mensaje
   */
  validateRuc(ruc: string): {
    valid: boolean;
    message: string;
  } {
    // Validar que sea una cadena numérica de 13 dígitos
    if (typeof ruc !== 'string' || !/^\d{13}$/.test(ruc)) {
      return {
        valid: false,
        message: 'RUC debe contener exactamente 13 dígitos numéricos.',
      };
    }

    // Validar provincia (primeros 2 dígitos, rango 0-24)
    const province = parseInt(ruc.substring(0, 2), 10);
    if (province < 0 || province > 24) {
      return {
        valid: false,
        message:
          'Provincia inválida en RUC (primeros 2 dígitos fuera de rango 0-24).',
      };
    }

    // Obtener el tercer dígito para determinar el tipo de RUC
    const thirdDigit = parseInt(ruc[2], 10);

    // RUC Natural (tercer dígito 0-5)
    if (thirdDigit >= 0 && thirdDigit <= 5) {
      return this.validateRucNatural(ruc);
    }
    // RUC Jurídico o extranjero sin cédula (tercer dígito 9)
    else if (thirdDigit === 9) {
      return this.validateRucJuridico(ruc);
    }
    // RUC Público (tercer dígito 6)
    else if (thirdDigit === 6) {
      return this.validateRucPublico(ruc);
    } else {
      return {
        valid: false,
        message: 'Tercer dígito del RUC inválido (debe ser 0-5, 6 o 9).',
      };
    }
  }

  /**
   * Valida un RUC Natural
   * Los 10 primeros dígitos se validan como si fueran una cédula
   *
   * @param ruc - Número de RUC
   * @returns Objeto con validez y mensaje
   */
  private validateRucNatural(ruc: string): {
    valid: boolean;
    message: string;
  } {
    // Extraer los 10 primeros dígitos
    const cedulaPart = ruc.substring(0, 10);

    // Validar como cédula
    const cedulaValidation = this.validateCedula(cedulaPart);

    if (cedulaValidation.valid) {
      return {
        valid: true,
        message: 'RUC Natural válido.',
      };
    } else {
      return {
        valid: false,
        message: 'RUC Natural inválido: ' + cedulaValidation.message,
      };
    }
  }

  /**
   * Valida un RUC Jurídico o de extranjero sin cédula
   * Tercer dígito: 9
   * Dígito verificador: posición 9 (décima posición)
   * Coeficientes: 4, 3, 2, 7, 6, 5, 4, 3, 2
   *
   * @param ruc - Número de RUC
   * @returns Objeto con validez y mensaje
   */
  private validateRucJuridico(ruc: string): {
    valid: boolean;
    message: string;
  } {
    // El dígito verificador está en la posición 9 (índice 9)
    const verifierPosition = 9;
    const verifier = parseInt(ruc[verifierPosition], 10);

    // Coeficientes para RUC Jurídico
    const coefficients = [4, 3, 2, 7, 6, 5, 4, 3, 2];

    let sum = 0;

    // Multiplicar los primeros 9 dígitos por sus coeficientes
    for (let i = 0; i < 9; i++) {
      const digit = parseInt(ruc[i], 10);
      const product = digit * coefficients[i];
      sum += product;
    }

    // Aplicar módulo 11
    const module = sum % 11;

    // Calcular dígito verificador esperado
    const expectedVerifier = module === 0 ? 0 : 11 - module;

    // Comparar
    if (verifier === expectedVerifier) {
      return {
        valid: true,
        message: 'RUC Jurídico válido.',
      };
    } else {
      return {
        valid: false,
        message: 'RUC Jurídico inválido: Dígito verificador no coincide.',
      };
    }
  }

  /**
   * Valida un RUC Público
   * Tercer dígito: 6
   * Dígito verificador: posición 8 (novena posición)
   * Coeficientes: 3, 2, 7, 6, 5, 4, 3, 2
   *
   * @param ruc - Número de RUC
   * @returns Objeto con validez y mensaje
   */
  private validateRucPublico(ruc: string): {
    valid: boolean;
    message: string;
  } {
    // El dígito verificador está en la posición 8 (índice 8, novena posición)
    const verifierPosition = 8;
    const verifier = parseInt(ruc[verifierPosition], 10);

    // Coeficientes para RUC Público
    const coefficients = [3, 2, 7, 6, 5, 4, 3, 2];

    let sum = 0;

    // Multiplicar los primeros 8 dígitos por sus coeficientes
    for (let i = 0; i < 8; i++) {
      const digit = parseInt(ruc[i], 10);
      const product = digit * coefficients[i];
      sum += product;
    }

    // Aplicar módulo 11
    const module = sum % 11;

    // Calcular dígito verificador esperado
    const expectedVerifier = module === 0 ? 0 : 11 - module;

    // Comparar
    if (verifier === expectedVerifier) {
      return {
        valid: true,
        message: 'RUC Público válido.',
      };
    } else {
      return {
        valid: false,
        message: 'RUC Público inválido: Dígito verificador no coincide.',
      };
    }
  }

  /**
   * Validador sincrónico para formularios reactivos
   * Valida cédulas ecuatorianas
   *
   * @returns ValidatorFn para usar en FormControl
   */
  cedulaValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // No validar si está vacío (usar required por separado)
      }

      const validation = this.validateCedula(control.value);
      return validation.valid ? null : { invalidCedula: { message: validation.message } };
    };
  }

  /**
   * Validador sincrónico para formularios reactivos
   * Valida RUCs ecuatorianos
   *
   * @returns ValidatorFn para usar en FormControl
   */
  rucValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // No validar si está vacío (usar required por separado)
      }

      const validation = this.validateRuc(control.value);
      return validation.valid ? null : { invalidRuc: { message: validation.message } };
    };
  }

  /**
   * Validador para tipo de documento
   * Valida cédula o RUC basado en el tipo de documento
   *
   * @param documentType - Tipo de documento ('Cedula', 'Ruc', 'Pasaporte')
   * @returns ValidatorFn para usar en FormControl
   */
  documentValidator(documentType: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      if (documentType === 'Cedula') {
        const validation = this.validateCedula(control.value);
        return validation.valid
          ? null
          : { invalidDocument: { message: validation.message } };
      } else if (documentType === 'Ruc') {
        const validation = this.validateRuc(control.value);
        return validation.valid
          ? null
          : { invalidDocument: { message: validation.message } };
      } else if (documentType === 'Pasaporte') {
        // Para pasaporte solo validar que tenga formato válido (alfanumérico, 6-15 caracteres)
        if (!/^[A-Z0-9]{6,15}$/.test(control.value)) {
          return {
            invalidDocument: {
              message: 'Pasaporte debe tener entre 6 y 15 caracteres alfanuméricos.',
            },
          };
        }
        return null;
      }

      return null;
    };
  }
}
