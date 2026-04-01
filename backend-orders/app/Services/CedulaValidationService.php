<?php

namespace App\Services;

/**
 * Servicio de Validación de Cédulas y RUCs Ecuatorianos
 * Implementa los algoritmos de validación según estándares de SRI (Servicio de Rentas Internas)
 */
class CedulaValidationService
{
    /**
     * Valida una cédula ecuatoriana
     * 
     * @param string $cedula
     * @return array ['valid' => bool, 'message' => string]
     */
    public static function validateCedula($cedula)
    {
        // Validar que sea una cadena numérica de 10 dígitos
        if (!is_string($cedula) || !preg_match('/^\d{10}$/', $cedula)) {
            return [
                'valid' => false,
                'message' => 'Cédula debe contener exactamente 10 dígitos numéricos.'
            ];
        }

        // Validar provincia (primeros 2 dígitos, rango 0-24)
        $province = (int) substr($cedula, 0, 2);
        if ($province < 0 || $province > 24) {
            return [
                'valid' => false,
                'message' => 'Provincia inválida (primeros 2 dígitos fuera de rango 0-24).'
            ];
        }

        // Coeficientes para validación de cédula
        $coefficients = [2, 1, 2, 1, 2, 1, 2, 1, 2];
        $sum = 0;

        // Multiplicar cada dígito (excepto el último) por su coeficiente
        for ($i = 0; $i < 9; $i++) {
            $digit = (int) $cedula[$i];
            $product = $digit * $coefficients[$i];

            // Si el producto es >= 10, restar 9
            if ($product >= 10) {
                $product -= 9;
            }

            $sum += $product;
        }

        // Aplicar módulo 10
        $module = $sum % 10;

        // Calcular dígito verificador
        if ($module === 0) {
            $verifier = 0;
        } else {
            $verifier = 10 - $module;
        }

        // Comparar con el dígito verificador de la cédula
        $lastDigit = (int) $cedula[9];

        if ($verifier === $lastDigit) {
            return [
                'valid' => true,
                'message' => 'Cédula válida.'
            ];
        } else {
            return [
                'valid' => false,
                'message' => 'Cédula inválida: Dígito verificador no coincide.'
            ];
        }
    }

    /**
     * Valida un RUC ecuatoriano
     * 
     * @param string $ruc
     * @return array ['valid' => bool, 'message' => string]
     */
    public static function validateRuc($ruc)
    {
        // Validar que sea una cadena numérica de 13 dígitos
        if (!is_string($ruc) || !preg_match('/^\d{13}$/', $ruc)) {
            return [
                'valid' => false,
                'message' => 'RUC debe contener exactamente 13 dígitos numéricos.'
            ];
        }

        // Validar provincia (primeros 2 dígitos, rango 0-24)
        $province = (int) substr($ruc, 0, 2);
        if ($province < 0 || $province > 24) {
            return [
                'valid' => false,
                'message' => 'Provincia inválida en RUC (primeros 2 dígitos fuera de rango 0-24).'
            ];
        }

        // Obtener el tercer dígito para determinar el tipo de RUC
        $thirdDigit = (int) $ruc[2];

        // RUC Natural (tercer dígito 0-5)
        if ($thirdDigit >= 0 && $thirdDigit <= 5) {
            return self::validateRucNatural($ruc);
        }
        // RUC Jurídico o extranjero sin cédula (tercer dígito 9)
        elseif ($thirdDigit === 9) {
            return self::validateRucJuridico($ruc);
        }
        // RUC Público (tercer dígito 6)
        elseif ($thirdDigit === 6) {
            return self::validateRucPublico($ruc);
        }
        else {
            return [
                'valid' => false,
                'message' => 'Tercer dígito del RUC inválido (debe ser 0-5, 6 o 9).'
            ];
        }
    }

    /**
     * Valida un RUC Natural
     * Los 10 primeros dígitos se validan como si fueran una cédula
     * 
     * @param string $ruc
     * @return array ['valid' => bool, 'message' => string]
     */
    private static function validateRucNatural($ruc)
    {
        // Extraer los 10 primeros dígitos
        $cedulaPart = substr($ruc, 0, 10);

        // Validar como cédula
        $cedulaValidation = self::validateCedula($cedulaPart);

        if ($cedulaValidation['valid']) {
            return [
                'valid' => true,
                'message' => 'RUC Natural válido.'
            ];
        } else {
            return [
                'valid' => false,
                'message' => 'RUC Natural inválido: ' . $cedulaValidation['message']
            ];
        }
    }

    /**
     * Valida un RUC Jurídico o de extranjero sin cédula
     * Tercer dígito: 9
     * Dígito verificador: posición 9 (décima posición)
     * Coeficientes: 4, 3, 2, 7, 6, 5, 4, 3, 2
     * 
     * @param string $ruc
     * @return array ['valid' => bool, 'message' => string]
     */
    private static function validateRucJuridico($ruc)
    {
        // El dígito verificador está en la posición 9 (índice 9)
        $verifierPosition = 9;
        $verifier = (int) $ruc[$verifierPosition];

        // Coeficientes para RUC Jurídico
        $coefficients = [4, 3, 2, 7, 6, 5, 4, 3, 2];

        $sum = 0;

        // Multiplicar los primeros 9 dígitos por sus coeficientes
        for ($i = 0; $i < 9; $i++) {
            $digit = (int) $ruc[$i];
            $product = $digit * $coefficients[$i];
            $sum += $product;
        }

        // Aplicar módulo 11
        $module = $sum % 11;

        // Calcular dígito verificador esperado
        if ($module === 0) {
            $expectedVerifier = 0;
        } else {
            $expectedVerifier = 11 - $module;
        }

        // Comparar
        if ($verifier === $expectedVerifier) {
            return [
                'valid' => true,
                'message' => 'RUC Jurídico válido.'
            ];
        } else {
            return [
                'valid' => false,
                'message' => 'RUC Jurídico inválido: Dígito verificador no coincide.'
            ];
        }
    }

    /**
     * Valida un RUC Público
     * Tercer dígito: 6
     * Dígito verificador: posición 8 (novena posición)
     * Coeficientes: 3, 2, 7, 6, 5, 4, 3, 2
     * 
     * @param string $ruc
     * @return array ['valid' => bool, 'message' => string]
     */
    private static function validateRucPublico($ruc)
    {
        // El dígito verificador está en la posición 8 (índice 8, novena posición)
        $verifierPosition = 8;
        $verifier = (int) $ruc[$verifierPosition];

        // Coeficientes para RUC Público
        $coefficients = [3, 2, 7, 6, 5, 4, 3, 2];

        $sum = 0;

        // Multiplicar los primeros 8 dígitos por sus coeficientes
        for ($i = 0; $i < 8; $i++) {
            $digit = (int) $ruc[$i];
            $product = $digit * $coefficients[$i];
            $sum += $product;
        }

        // Aplicar módulo 11
        $module = $sum % 11;

        // Calcular dígito verificador esperado
        if ($module === 0) {
            $expectedVerifier = 0;
        } else {
            $expectedVerifier = 11 - $module;
        }

        // Comparar
        if ($verifier === $expectedVerifier) {
            return [
                'valid' => true,
                'message' => 'RUC Público válido.'
            ];
        } else {
            return [
                'valid' => false,
                'message' => 'RUC Público inválido: Dígito verificador no coincide.'
            ];
        }
    }
}
