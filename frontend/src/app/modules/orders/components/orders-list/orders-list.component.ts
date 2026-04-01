import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OrderService, Order } from '@core/services/order.service';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { AlertComponent } from '@shared/components/alert/alert.component';

@Component({
  selector: 'app-orders-list',
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingComponent, AlertComponent, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto py-10 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Pedidos</h1>
        <a routerLink="/orders/new" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
          + Nuevo Pedido
        </a>
      </div>

      <div class="mb-6 flex gap-4">
        <select [(ngModel)]="filterStatus" (change)="applyFilters()" class="px-3 py-2 border border-gray-300 rounded-md">
          <option value="">Todos los Estados</option>
          <option value="pending">Pendiente</option>
          <option value="completed">Completado</option>
          <option value="cancelled">Cancelado</option>
        </select>
      </div>

      <app-alert [alert]="alert"></app-alert>

      <app-loading [isLoading]="isLoading"></app-loading>

      <div *ngIf="!isLoading" class="bg-white rounded-lg shadow overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pedido #</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Creado</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr *ngFor="let order of orders" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ order.orderNumber }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <span [ngClass]="getStatusClass(order.status)" class="px-2 py-1 rounded-md text-white text-xs font-medium">
                  {{ order.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ order.totalAmount | currency }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ order.createdAt | date: 'short' }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <a [routerLink]="['/orders', order.id]" class="text-blue-600 hover:text-blue-900">Ver</a>
                <a [routerLink]="['/orders', order.id, 'edit']" class="text-blue-600 hover:text-blue-900 ml-4">Editar</a>
                <button (click)="deleteOrder(order.id)" class="text-red-600 hover:text-red-900 ml-4">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: []
})
export class OrdersListComponent implements OnInit {
  orders: Order[] = [];
  isLoading = false;
  alert: any = null;
  filterStatus: string = '';

  constructor(private orderService: OrderService) { }

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.isLoading = true;
    this.orderService.getOrders().subscribe(
      (data) => {
        this.orders = data;
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
        this.alert = { type: 'error', message: 'Error al cargar pedidos' };
      }
    );
  }

  applyFilters() {
    this.loadOrders();
  }

  deleteOrder(id: string) {
    if (confirm('¿Estás seguro de que deseas eliminar este pedido?')) {
      this.orderService.deleteOrder(id).subscribe(
        () => {
          this.alert = { type: 'success', message: 'Pedido eliminado' };
          this.loadOrders();
        },
        () => {
          this.alert = { type: 'error', message: 'Error al eliminar pedido' };
        }
      );
    }
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
