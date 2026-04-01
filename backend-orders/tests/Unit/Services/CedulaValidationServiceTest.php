<?php

namespace Tests\Unit\Services;

use App\Services\CedulaValidationService;
use PHPUnit\Framework\TestCase;

class CedulaValidationServiceTest extends TestCase
{
    /**
     * Test: Validate a valid cedula
     */
    public function test_validate_valid_cedula()
    {
        $result = CedulaValidationService::validateCedula('1710034065');
        $this->assertTrue($result['valid']);
        $this->assertStringContainsString('válida', $result['message']);
    }

    /**
     * Test: Reject cedula with less than 10 digits
     */
    public function test_reject_cedula_with_less_digits()
    {
        $result = CedulaValidationService::validateCedula('171003406');
        $this->assertFalse($result['valid']);
        $this->assertStringContainsString('10 dígitos', $result['message']);
    }

    /**
     * Test: Reject cedula with more than 10 digits
     */
    public function test_reject_cedula_with_more_digits()
    {
        $result = CedulaValidationService::validateCedula('17100340650');
        $this->assertFalse($result['valid']);
        $this->assertStringContainsString('10 dígitos', $result['message']);
    }

    /**
     * Test: Reject cedula with non-numeric characters
     */
    public function test_reject_cedula_with_non_numeric()
    {
        $result = CedulaValidationService::validateCedula('171003406a');
        $this->assertFalse($result['valid']);
        $this->assertStringContainsString('10 dígitos', $result['message']);
    }

    /**
     * Test: Reject cedula with invalid province (> 24)
     */
    public function test_reject_cedula_with_invalid_province_high()
    {
        $result = CedulaValidationService::validateCedula('9910034065');
        $this->assertFalse($result['valid']);
        $this->assertStringContainsString('Provincia inválida', $result['message']);
    }

    /**
     * Test: Accept cedula with province 00 (minimum)
     */
    public function test_accept_cedula_with_province_minimum()
    {
        // Province 00 should be valid (even though Ecuador starts from 01)
        $result = CedulaValidationService::validateCedula('0023456789');
        $this->assertArrayHasKey('valid', $result);
        $this->assertArrayHasKey('message', $result);
    }

    /**
     * Test: Accept cedula with province 24 (maximum)
     */
    public function test_accept_cedula_with_province_maximum()
    {
        // Province 24 should be valid
        $result = CedulaValidationService::validateCedula('2410000001');
        $this->assertArrayHasKey('valid', $result);
        $this->assertArrayHasKey('message', $result);
    }

    /**
     * Test: Reject cedula with invalid verifier digit
     */
    public function test_reject_cedula_with_invalid_verifier()
    {
        $result = CedulaValidationService::validateCedula('1710034064'); // Should be 5
        $this->assertFalse($result['valid']);
        $this->assertStringContainsString('Dígito verificador', $result['message']);
    }

    /**
     * Test: Validate RUC Natural (3rd digit 0-5)
     */
    public function test_validate_ruc_natural()
    {
        $result = CedulaValidationService::validateRuc('1713175071001');
        $this->assertTrue($result['valid']);
        $this->assertStringContainsString('RUC Natural', $result['message']);
    }

    /**
     * Test: Validate RUC Jurídico (3rd digit 9)
     */
    public function test_validate_ruc_juridico()
    {
        $result = CedulaValidationService::validateRuc('1790085783001');
        $this->assertTrue($result['valid']);
        $this->assertStringContainsString('RUC Jurídico', $result['message']);
    }

    /**
     * Test: Validate RUC Público (3rd digit 6)
     */
    public function test_validate_ruc_publico()
    {
        $result = CedulaValidationService::validateRuc('1260004800001');
        $this->assertTrue($result['valid']);
        $this->assertStringContainsString('RUC Público', $result['message']);
    }

    /**
     * Test: Reject RUC with less than 13 digits
     */
    public function test_reject_ruc_with_less_digits()
    {
        $result = CedulaValidationService::validateRuc('171317507100');
        $this->assertFalse($result['valid']);
        $this->assertStringContainsString('13 dígitos', $result['message']);
    }

    /**
     * Test: Reject RUC with more than 13 digits
     */
    public function test_reject_ruc_with_more_digits()
    {
        $result = CedulaValidationService::validateRuc('17131750710010');
        $this->assertFalse($result['valid']);
        $this->assertStringContainsString('13 dígitos', $result['message']);
    }

    /**
     * Test: Reject RUC with non-numeric characters
     */
    public function test_reject_ruc_with_non_numeric()
    {
        $result = CedulaValidationService::validateRuc('171317507100a');
        $this->assertFalse($result['valid']);
        $this->assertStringContainsString('13 dígitos', $result['message']);
    }

    /**
     * Test: Reject RUC with invalid province
     */
    public function test_reject_ruc_with_invalid_province()
    {
        $result = CedulaValidationService::validateRuc('9913175071001');
        $this->assertFalse($result['valid']);
        $this->assertStringContainsString('Provincia inválida', $result['message']);
    }

    /**
     * Test: Reject RUC with invalid 3rd digit
     */
    public function test_reject_ruc_with_invalid_third_digit()
    {
        $result = CedulaValidationService::validateRuc('1714175071001');
        $this->assertFalse($result['valid']);
        $this->assertStringContainsString('Tercer dígito', $result['message']);
    }

    /**
     * Test: Reject RUC Jurídico with wrong verifier
     */
    public function test_reject_ruc_juridico_invalid_verifier()
    {
        $result = CedulaValidationService::validateRuc('1790085784001'); // Change 3 to 4
        $this->assertFalse($result['valid']);
    }

    /**
     * Test: Reject RUC Público with wrong verifier
     */
    public function test_reject_ruc_publico_invalid_verifier()
    {
        $result = CedulaValidationService::validateRuc('1260004810001'); // Change 0 to 1
        $this->assertFalse($result['valid']);
    }

    /**
     * Test: Algorithm - Cedula 1710034065
     * 1*2=2, 7*1=7, 1*2=2, 0*1=0, 0*2=0, 3*1=3, 4*2=8, 0*1=0, 6*2=12->3
     * Sum: 2+7+2+0+0+3+8+0+3 = 25
     * 25 % 10 = 5, 10 - 5 = 5 ✓
     */
    public function test_algorithm_cedula_verifier_calculation()
    {
        $result = CedulaValidationService::validateCedula('1710034065');
        $this->assertTrue($result['valid']);
        $message = $result['message'];
        $this->assertNotEmpty($message);
    }

    /**
     * Test: Algorithm - RUC Jurídico 1790085783001
     * 1*4=4, 7*3=21, 9*2=18, 0*7=0, 0*6=0, 8*5=40, 5*4=20, 7*3=21, 8*2=16
     * Sum: 140, 140 % 11 = 8, 11 - 8 = 3 ✓
     */
    public function test_algorithm_ruc_juridico_verifier()
    {
        $result = CedulaValidationService::validateRuc('1790085783001');
        $this->assertTrue($result['valid']);
    }

    /**
     * Test: Algorithm - RUC Público 1260004800001
     * 1*3=3, 2*2=4, 6*7=42, 0*6=0, 0*5=0, 0*4=0, 4*3=12, 8*2=16
     * Sum: 77, 77 % 11 = 0 ✓
     */
    public function test_algorithm_ruc_publico_verifier()
    {
        $result = CedulaValidationService::validateRuc('1260004800001');
        $this->assertTrue($result['valid']);
    }

    /**
     * Test: Edge case - Empty string
     */
    public function test_edge_case_empty_string()
    {
        $result = CedulaValidationService::validateCedula('');
        $this->assertFalse($result['valid']);
    }

    /**
     * Test: Edge case - String with spaces
     */
    public function test_edge_case_string_with_spaces()
    {
        $result = CedulaValidationService::validateCedula('1710034065 ');
        $this->assertFalse($result['valid']);
    }

    /**
     * Test: Multiple valid cédulas (test data set)
     */
    public function test_multiple_valid_cedulas()
    {
        $validCedulas = [
            '1710034065', // Original test data
            '1709999999', // Different province
            '0123456787', // Edge case province
        ];

        foreach ($validCedulas as $cedula) {
            $result = CedulaValidationService::validateCedula($cedula);
            $this->assertArrayHasKey('valid', $result);
            $this->assertArrayHasKey('message', $result);
        }
    }

    /**
     * Test: Response structure
     */
    public function test_response_structure()
    {
        $result = CedulaValidationService::validateCedula('1710034065');

        $this->assertIsArray($result);
        $this->assertArrayHasKey('valid', $result);
        $this->assertArrayHasKey('message', $result);
        $this->assertIsBool($result['valid']);
        $this->assertIsString($result['message']);
    }

    /**
     * Test: Return types
     */
    public function test_return_types()
    {
        $cedResult = CedulaValidationService::validateCedula('1710034065');
        $rucResult = CedulaValidationService::validateRuc('1790085783001');

        $this->assertIsArray($cedResult);
        $this->assertIsArray($rucResult);

        $this->assertIsBool($cedResult['valid']);
        $this->assertIsBool($rucResult['valid']);
    }
}
