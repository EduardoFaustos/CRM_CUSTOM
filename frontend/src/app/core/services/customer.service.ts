import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

export interface Customer {
  cedula: string; // Cédula ecuatoriana (PK)
  tipo_documento: 'Cedula' | 'Ruc' | 'Pasaporte';
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCustomerRequest {
  cedula: string; // 10 dígitos para cédula ecuatoriana
  tipo_documento: 'Cedula' | 'Ruc' | 'Pasaporte';
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http: HttpClient) { }

  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${environment.ordersApiUrl}/customers`);
  }

  getCustomerById(cedula: string): Observable<Customer> {
    return this.http.get<Customer>(`${environment.ordersApiUrl}/customers/${cedula}`);
  }

  createCustomer(request: CreateCustomerRequest): Observable<Customer> {
    return this.http.post<Customer>(`${environment.ordersApiUrl}/customers`, request);
  }

  updateCustomer(cedula: string, request: Partial<CreateCustomerRequest>): Observable<Customer> {
    return this.http.put<Customer>(`${environment.ordersApiUrl}/customers/${cedula}`, request);
  }

  deleteCustomer(cedula: string): Observable<void> {
    return this.http.delete<void>(`${environment.ordersApiUrl}/customers/${cedula}`);
  }
}
