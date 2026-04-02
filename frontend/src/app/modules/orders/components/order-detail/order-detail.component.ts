import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { OrderService, Order } from '@core/services/order.service';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { AlertComponent } from '@shared/components/alert/alert.component';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingComponent, AlertComponent],
  template: `
    <div class="max-w-4xl mx-auto py-10 sm:px-6 lg:px-8">
      <app-loading [isLoading]="isLoading"></app-loading>
      <app-alert [alert]="alert"></app-alert>
      
      <div *ngIf="!isLoading && order" class="bg-white rounded-lg shadow overflow-hidden">
        <div class="px-4 py-5 sm:p-6">
          <div class="flex justify-between items-center mb-6">
            <h1 class="text-3xl font-bold text-gray-900">Pedido {{ order.orderNumber }}</h1>
            <span [ngClass]="getStatusClass(order.status)" class="px-3 py-1 rounded-md text-white font-medium">
              {{ order.status }}
            </span>
          </div>

          <!-- Estado Actions -->
          <div class="mb-6 p-4 bg-gray-50 rounded-md">
            <p class="text-sm font-medium text-gray-700 mb-3">Cambiar Estado:</p>
            <div class="flex gap-2">
              <button 
                *ngIf="order.status !== 'completed'"
                (click)="updateStatus('completed')"
                [disabled]="statusUpdating"
                class="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-3 py-1 rounded-md text-sm">
                Marcar Completado
              </button>
              <button 
                *ngIf="order.status !== 'pending'"
                (click)="updateStatus('pending')"
                [disabled]="statusUpdating"
                class="bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-400 text-white px-3 py-1 rounded-md text-sm">
                Marcar Pendiente
              </button>
              <button 
                *ngIf="order.status !== 'cancelled'"
                (click)="updateStatus('cancelled')"
                [disabled]="statusUpdating"
                class="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-3 py-1 rounded-md text-sm">
                Marcar Cancelado
              </button>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-6 mb-8">
            <div>
              <p class="text-sm text-gray-500">Fecha del Pedido</p>
              <p class="text-lg text-gray-900">{{ order.createdAt | date: 'short' }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Monto Total</p>
              <p class="text-lg text-gray-900 font-bold">{{ order.totalAmount | currency }}</p>
            </div>
          </div>

          <h2 class="text-xl font-bold text-gray-900 mb-4">Artículos</h2>
          <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cantidad</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr *ngFor="let item of order.items">
                  <td class="px-6 py-4 text-sm text-gray-900">{{ item.productName }}</td>
                  <td class="px-6 py-4 text-sm text-gray-900">{{ item.quantity }}</td>
                  <td class="px-6 py-4 text-sm text-gray-900">{{ item.unitPrice | currency }}</td>
                  <td class="px-6 py-4 text-sm text-gray-900 font-bold">{{ item.total | currency }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="mt-6">
            <a [routerLink]="['/orders', order.id, 'edit']" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md mr-4">
              Editar
            </a>
            <a routerLink="/orders" class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md">
              Atrás
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class OrderDetailComponent implements OnInit {
  order: Order | null = null;
  isLoading = false;
  statusUpdating = false;
  alert: any = null;

  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.loadOrder(id);
    });
  }

  loadOrder(id: string) {
    this.isLoading = true;
    this.orderService.getOrderById(id).subscribe(
      (data) => {
        this.order = data;
        this.isLoading = false;
      },
      () => {
        this.isLoading = false;
        this.alert = { type: 'error', message: 'Error al cargar el pedido' };
      }
    );
  }

  updateStatus(newStatus: 'pending' | 'completed' | 'cancelled') {
    if (!this.order) return;
    
    this.statusUpdating = true;
    this.orderService.updateOrderStatus(this.order.id, newStatus).subscribe(
      (updatedOrder) => {
        this.order = updatedOrder;
        this.statusUpdating = false;
        this.alert = { type: 'success', message: 'Estado actualizado correctamente' };
      },
      () => {
        this.statusUpdating = false;
        this.alert = { type: 'error', message: 'Error al actualizar el estado' };
      }
    );
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  }
}
