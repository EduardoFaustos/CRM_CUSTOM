import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { CustomerService, Customer } from '@core/services/customer.service';
import { LoadingComponent } from '@shared/components/loading/loading.component';

@Component({
  selector: 'app-customer-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingComponent],
  template: `
    <div class="max-w-4xl mx-auto py-10 sm:px-6 lg:px-8">
      <app-loading [isLoading]="isLoading"></app-loading>
      
      <div *ngIf="!isLoading && customer" class="bg-white rounded-lg shadow overflow-hidden">
        <div class="px-4 py-5 sm:p-6">
          <h1 class="text-3xl font-bold text-gray-900 mb-6">{{ customer.name }}</h1>
          
          <div class="grid grid-cols-2 gap-6">
            <div>
              <p class="text-sm text-gray-500">Correo</p>
              <p class="text-lg text-gray-900">{{ customer.email }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Teléfono</p>
              <p class="text-lg text-gray-900">{{ customer.phone }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Dirección</p>
              <p class="text-lg text-gray-900">{{ customer.address }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Ciudad, Provincia CP</p>
              <p class="text-lg text-gray-900">{{ customer.city }}, {{ customer.state }} {{ customer.zip_code }}</p>
            </div>
          </div>

          <div class="mt-6">
            <a [routerLink]="['/customers', customer.cedula, 'edit']" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md mr-4">
              Editar
            </a>
            <a routerLink="/customers" class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md">
              Atrás
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class CustomerDetailComponent implements OnInit {
  customer: Customer | null = null;
  isLoading = false;

  constructor(
    private customerService: CustomerService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.loadCustomer(id);
    });
  }

  loadCustomer(id: string) {
    this.isLoading = true;
    this.customerService.getCustomerById(id).subscribe(
      (data) => {
        this.customer = data;
        this.isLoading = false;
      },
      () => {
        this.isLoading = false;
      }
    );
  }
}
