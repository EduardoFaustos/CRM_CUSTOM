<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Services\CedulaValidationService;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    /**
     * Display a listing of customers.
     */
    public function index()
    {
        return response()->json(Customer::all(), 200);
    }

    /**
     * Store a newly created customer with Ecuadorian validation.
     */
    public function store(Request $request)
    {
        // Validación básica de estructura
        $basicValidation = $request->validate([
            'cedula' => 'required|string|size:10',
            'tipo_documento' => 'required|in:Cedula,Ruc,Pasaporte',
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:customers,email',
            'phone' => 'required|string',
            'address' => 'required|string',
            'city' => 'required|string',
            'state' => 'required|string',
            'zip_code' => 'required|string'
        ]);

        // Validación de cédula según estándar ecuatoriano
        if ($basicValidation['tipo_documento'] === 'Cedula') {
            $cedulaValidation = CedulaValidationService::validateCedula($basicValidation['cedula']);
            if (!$cedulaValidation['valid']) {
                return response()->json([
                    'message' => 'Validación fallada',
                    'errors' => [
                        'cedula' => [$cedulaValidation['message']]
                    ]
                ], 422);
            }

            // Validar unicidad de cédula
            if (Customer::where('cedula', $basicValidation['cedula'])->exists()) {
                return response()->json([
                    'message' => 'Validación fallada',
                    'errors' => [
                        'cedula' => ['La cédula ya está registrada en el sistema.']
                    ]
                ], 422);
            }
        }
        // Validación de RUC según estándar ecuatoriano
        elseif ($basicValidation['tipo_documento'] === 'Ruc') {
            $rucValidation = CedulaValidationService::validateRuc($basicValidation['cedula']);
            if (!$rucValidation['valid']) {
                return response()->json([
                    'message' => 'Validación fallada',
                    'errors' => [
                        'cedula' => [$rucValidation['message']]
                    ]
                ], 422);
            }

            // Validar unicidad de RUC
            if (Customer::where('cedula', $basicValidation['cedula'])->exists()) {
                return response()->json([
                    'message' => 'Validación fallada',
                    'errors' => [
                        'cedula' => ['El RUC ya está registrado en el sistema.']
                    ]
                ], 422);
            }
        }
        // Para Pasaporte: validación básica alfanumérica
        elseif ($basicValidation['tipo_documento'] === 'Pasaporte') {
            if (!preg_match('/^[A-Z0-9]{6,15}$/', $basicValidation['cedula'])) {
                return response()->json([
                    'message' => 'Validación fallada',
                    'errors' => [
                        'cedula' => ['Pasaporte debe tener entre 6 y 15 caracteres alfanuméricos.']
                    ]
                ], 422);
            }

            // Validar unicidad de Pasaporte
            if (Customer::where('cedula', $basicValidation['cedula'])->exists()) {
                return response()->json([
                    'message' => 'Validación fallada',
                    'errors' => [
                        'cedula' => ['El pasaporte ya está registrado en el sistema.']
                    ]
                ], 422);
            }
        }

        $customer = Customer::create($basicValidation);
        return response()->json($customer, 201);
    }

    /**
     * Display the specified customer.
     */
    public function show(Customer $customer)
    {
        return response()->json($customer, 200);
    }

    /**
     * Update the specified customer.
     */
    public function update(Request $request, Customer $customer)
    {
        $validated = $request->validate([
            'tipo_documento' => 'sometimes|in:Cedula,Ruc,Pasaporte',
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:customers,email,'.$customer->cedula,
            'phone' => 'sometimes|string',
            'address' => 'sometimes|string',
            'city' => 'sometimes|string',
            'state' => 'sometimes|string',
            'zip_code' => 'sometimes|string'
        ]);

        $customer->update($validated);
        return response()->json($customer, 200);
    }

    /**
     * Remove the specified customer.
     */
    public function destroy(Customer $customer)
    {
        $customer->delete();
        return response()->json(null, 204);
    }
}
