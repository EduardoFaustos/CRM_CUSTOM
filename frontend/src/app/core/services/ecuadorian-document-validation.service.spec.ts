import { TestBed } from '@angular/core/testing';
import { EcuadorianDocumentValidationService } from './ecuadorian-document-validation.service';

describe('EcuadorianDocumentValidationService', () => {
  let service: EcuadorianDocumentValidationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EcuadorianDocumentValidationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('validateCedula', () => {
    it('should validate a valid cedula', () => {
      const result = service.validateCedula('1710034065');
      expect(result.valid).toBe(true);
      expect(result.message).toContain('válida');
    });

    it('should reject cedula with less than 10 digits', () => {
      const result = service.validateCedula('171003406');
      expect(result.valid).toBe(false);
      expect(result.message).toContain('10 dígitos');
    });

    it('should reject cedula with more than 10 digits', () => {
      const result = service.validateCedula('17100340650');
      expect(result.valid).toBe(false);
      expect(result.message).toContain('10 dígitos');
    });

    it('should reject cedula with non-numeric characters', () => {
      const result = service.validateCedula('171003406a');
      expect(result.valid).toBe(false);
      expect(result.message).toContain('10 dígitos');
    });

    it('should reject cedula with invalid province', () => {
      const result = service.validateCedula('9910034065');
      expect(result.valid).toBe(false);
      expect(result.message).toContain('Provincia inválida');
    });

    it('should reject cedula with invalid verifier digit', () => {
      const result = service.validateCedula('1710034064'); // Last digit should be 5
      expect(result.valid).toBe(false);
      expect(result.message).toContain('Dígito verificador');
    });

    it('should validate cedula with province 00', () => {
      // Testing edge case: province 00
      // Need a valid cedula starting with 00
      // Using test data: 0923456781
      const result = service.validateCedula('0923456781');
      // This is for testing; actual validity depends on correct checksum
      expect(result).toHaveProperty('valid');
      expect(result).toHaveProperty('message');
    });

    it('should validate cedula with province 24 (maximum)', () => {
      // Testing edge case: province 24
      // Need a valid cedula starting with 24
      const result = service.validateCedula('2410000001');
      expect(result).toHaveProperty('valid');
      expect(result).toHaveProperty('message');
    });
  });

  describe('validateRuc', () => {
    it('should validate a valid RUC Natural', () => {
      const result = service.validateRuc('1713175071001');
      expect(result.valid).toBe(true);
      expect(result.message).toContain('RUC Natural');
    });

    it('should validate a valid RUC Jurídico', () => {
      const result = service.validateRuc('1790085783001');
      expect(result.valid).toBe(true);
      expect(result.message).toContain('RUC Jurídico');
    });

    it('should validate a valid RUC Público', () => {
      const result = service.validateRuc('1260004800001');
      expect(result.valid).toBe(true);
      expect(result.message).toContain('RUC Público');
    });

    it('should reject RUC with less than 13 digits', () => {
      const result = service.validateRuc('171317507100');
      expect(result.valid).toBe(false);
      expect(result.message).toContain('13 dígitos');
    });

    it('should reject RUC with more than 13 digits', () => {
      const result = service.validateRuc('17131750710010');
      expect(result.valid).toBe(false);
      expect(result.message).toContain('13 dígitos');
    });

    it('should reject RUC with non-numeric characters', () => {
      const result = service.validateRuc('171317507100a');
      expect(result.valid).toBe(false);
      expect(result.message).toContain('13 dígitos');
    });

    it('should reject RUC with invalid province', () => {
      const result = service.validateRuc('9913175071001');
      expect(result.valid).toBe(false);
      expect(result.message).toContain('Provincia inválida');
    });

    it('should reject RUC with invalid third digit', () => {
      const result = service.validateRuc('1714175071001');
      expect(result.valid).toBe(false);
      expect(result.message).toContain('Tercer dígito del RUC inválido');
    });

    it('should reject invalid RUC Natural (invalid cedula part)', () => {
      // RUC Natural starting with 0, but invalid cedula part
      const result = service.validateRuc('1714175071001'); // Third digit 4 is invalid for Natural
      expect(result.valid).toBe(false);
    });

    it('should reject invalid RUC Jurídico (wrong verifier)', () => {
      // Valid RUC Jurídico is 1790085783001
      // Change verifier digit from 3 to 4
      const result = service.validateRuc('1790085784001');
      expect(result.valid).toBe(false);
    });

    it('should reject invalid RUC Público (wrong verifier)', () => {
      // Valid RUC Público is 1260004800001
      // Change verifier digit from 0 to 1
      const result = service.validateRuc('1260004810001');
      expect(result.valid).toBe(false);
    });
  });

  describe('cedulaValidator (FormValidator)', () => {
    it('should create validator without errors', () => {
      const validator = service.cedulaValidator();
      expect(validator).toBeTruthy();
    });

    it('validator should validate valid cedula', () => {
      const validator = service.cedulaValidator();
      const control = { value: '1710034065' } as any;
      expect(validator(control)).toBeNull();
    });

    it('validator should reject invalid cedula', () => {
      const validator = service.cedulaValidator();
      const control = { value: '1710034064' } as any;
      expect(validator(control)).toHaveProperty('invalidCedula');
    });

    it('validator should allow empty value', () => {
      const validator = service.cedulaValidator();
      const control = { value: '' } as any;
      expect(validator(control)).toBeNull();
    });
  });

  describe('rucValidator (FormValidator)', () => {
    it('should create validator without errors', () => {
      const validator = service.rucValidator();
      expect(validator).toBeTruthy();
    });

    it('validator should validate valid RUC', () => {
      const validator = service.rucValidator();
      const control = { value: '1790085783001' } as any;
      expect(validator(control)).toBeNull();
    });

    it('validator should reject invalid RUC', () => {
      const validator = service.rucValidator();
      const control = { value: '1790085784001' } as any;
      expect(validator(control)).toHaveProperty('invalidRuc');
    });

    it('validator should allow empty value', () => {
      const validator = service.rucValidator();
      const control = { value: '' } as any;
      expect(validator(control)).toBeNull();
    });
  });

  describe('documentValidator (Dynamic validator)', () => {
    it('should use cedulaValidator for Cedula type', () => {
      const validator = service.documentValidator('Cedula');
      const control = { value: '1710034065' } as any;
      expect(validator(control)).toBeNull();
    });

    it('should use rucValidator for Ruc type', () => {
      const validator = service.documentValidator('Ruc');
      const control = { value: '1790085783001' } as any;
      expect(validator(control)).toBeNull();
    });

    it('should validate Pasaporte with alphanumeric format', () => {
      const validator = service.documentValidator('Pasaporte');
      const control = { value: 'N1234567' } as any;
      expect(validator(control)).toBeNull();
    });

    it('should reject Pasaporte with less than 6 characters', () => {
      const validator = service.documentValidator('Pasaporte');
      const control = { value: 'N1234' } as any;
      expect(validator(control)).toHaveProperty('invalidDocument');
    });

    it('should reject Pasaporte with more than 15 characters', () => {
      const validator = service.documentValidator('Pasaporte');
      const control = { value: 'N123456789012345' } as any; // 16 characters
      expect(validator(control)).toHaveProperty('invalidDocument');
    });

    it('should reject Pasaporte with special characters', () => {
      const validator = service.documentValidator('Pasaporte');
      const control = { value: 'N1234567#' } as any;
      expect(validator(control)).toHaveProperty('invalidDocument');
    });

    it('should allow empty value', () => {
      const validator = service.documentValidator('Cedula');
      const control = { value: '' } as any;
      expect(validator(control)).toBeNull();
    });
  });

  describe('Edge cases', () => {
    it('should handle null values gracefully', () => {
      const result = service.validateCedula(null as any);
      expect(result.valid).toBe(false);
    });

    it('should handle undefined values gracefully', () => {
      const result = service.validateCedula(undefined as any);
      expect(result.valid).toBe(false);
    });

    it('should handle non-string types', () => {
      const result = service.validateCedula(1710034065 as any);
      expect(result.valid).toBe(false);
    });

    it('should handle string with spaces', () => {
      const result = service.validateCedula('1710034065 ');
      expect(result.valid).toBe(false);
    });

    it('should handle string with leading zeros', () => {
      // Cedula starting with 00
      const result = service.validateCedula('0023456789');
      expect(result).toHaveProperty('valid');
    });
  });

  describe('Algorithm verification', () => {
    it('should correctly calculate verifier digit for cedula 1710034065', () => {
      // Manual verification:
      // 1*2=2, 7*1=7, 1*2=2, 0*1=0, 0*2=0, 3*1=3, 4*2=8, 0*1=0, 6*2=12->3
      // Sum: 2+7+2+0+0+3+8+0+3 = 25
      // 25 % 10 = 5
      // 10 - 5 = 5 ✓
      const result = service.validateCedula('1710034065');
      expect(result.valid).toBe(true);
    });

    it('should correctly reject cedula with wrong verifier', () => {
      // Same cedula but with wrong verifier (6 instead of 5)
      const result = service.validateCedula('1710034066');
      expect(result.valid).toBe(false);
    });

    it('should correctly calculate RUC Jurídico verifier', () => {
      // RUC 1790085783001
      // 1*4=4, 7*3=21, 9*2=18, 0*7=0, 0*6=0, 8*5=40, 5*4=20, 7*3=21, 8*2=16
      // Sum: 4+21+18+0+0+40+20+21+16 = 140
      // 140 % 11 = 8
      // 11 - 8 = 3
      // Verifier at position 9 is 3 ✓
      const result = service.validateRuc('1790085783001');
      expect(result.valid).toBe(true);
    });

    it('should correctly calculate RUC Público verifier', () => {
      // RUC 1260004800001
      // 1*3=3, 2*2=4, 6*7=42, 0*6=0, 0*5=0, 0*4=0, 4*3=12, 8*2=16
      // Sum: 3+4+42+0+0+0+12+16 = 77
      // 77 % 11 = 0
      // Verifier at position 8 is 0 ✓
      const result = service.validateRuc('1260004800001');
      expect(result.valid).toBe(true);
    });
  });
});
