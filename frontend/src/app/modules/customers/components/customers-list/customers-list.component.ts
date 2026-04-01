import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CustomerService, Customer } from '@core/services/customer.service';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { AlertComponent } from '@shared/components/alert/alert.component';

@Component({
  selector: 'app-customers-list',
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingComponent, AlertComponent],
  template: `
    <div class="max-w-7xl mx-auto py-10 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Clientes</h1>
        <a routerLink="/customers/new" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
          + Nuevo Cliente
        </a>
      </div>

      <app-alert [alert]="alert"></app-alert>

      <app-loading [isLoading]="isLoading"></app-loading>

      <div *ngIf="!isLoading" class="bg-white rounded-lg shadow overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Correo</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ciudad</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr *ngFor="let customer of customers" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ customer.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ customer.email }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ customer.phone }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ customer.city }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <a [routerLink]="['/customers', customer.cedula]" class="text-blue-600 hover:text-blue-900">Ver</a>
                <a [routerLink]="['/customers', customer.cedula, 'edit']" class="text-blue-600 hover:text-blue-900 ml-4">Editar</a>
                <button (click)="deleteCustomer(customer.cedula)" class="text-red-600 hover:text-red-900 ml-4">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: []
})
export class CustomersListComponent implements OnInit {
  customers: Customer[] = [];
  isLoading = false;
  alert: any = null;

  constructor(private customerService: CustomerService) { }

  ngOnInit() {
    this.loadCustomers();
  }

  loadCustomers() {
    this.isLoading = true;
    this.customerService.getCustomers().subscribe(
      (data) => {
        this.customers = data;
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
        this.alert = { type: 'error', message: 'Error al cargar clientes' };
      }
    );
  }

  deleteCustomer(id: string) {
    if (confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
      this.customerService.deleteCustomer(id).subscribe(
        () => {
          this.alert = { type: 'success', message: 'Cliente eliminado' };
          this.loadCustomers();
        },
        () => {
          this.alert = { type: 'error', message: 'Error al eliminar cliente' };
        }
      );
    }
  }
}
