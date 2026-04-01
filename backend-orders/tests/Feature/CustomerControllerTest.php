// PHP Test Example
<?php

namespace Tests\Feature;

use Tests\TestCase;

class CustomerControllerTest extends TestCase
{
    /**
     * Test get all customers.
     */
    public function test_get_customers()
    {
        $response = $this->get('/api/customers');
        
        $response->assertStatus(200)
            ->assertJsonStructure([
                '*' => [
                    'id',
                    'name',
                    'email',
                    'phone',
                    'address',
                    'city',
                    'state',
                    'zip_code',
                    'created_at',
                    'updated_at'
                ]
            ]);
    }

    /**
     * Test create customer.
     */
    public function test_create_customer()
    {
        $data = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'phone' => '555-1234',
            'address' => '123 Main St',
            'city' => 'New York',
            'state' => 'NY',
            'zip_code' => '10001'
        ];

        $response = $this->post('/api/customers', $data);
        
        $response->assertStatus(201)
            ->assertJsonFragment($data);
    }

    /**
     * Test get customer by id.
     */
    public function test_get_customer()
    {
        $response = $this->get('/api/customers/1');
        
        $response->assertStatus(200)
            ->assertJsonStructure([
                'id',
                'name',
                'email',
                'phone'
            ]);
    }

    /**
     * Test update customer.
     */
    public function test_update_customer()
    {
        $data = ['name' => 'Jane Doe'];
        $response = $this->put('/api/customers/1', $data);
        
        $response->assertStatus(200)
            ->assertJsonFragment($data);
    }

    /**
     * Test delete customer.
     */
    public function test_delete_customer()
    {
        $response = $this->delete('/api/customers/1');
        $response->assertStatus(204);
    }
}
