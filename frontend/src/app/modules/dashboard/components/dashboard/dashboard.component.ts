import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService, DashboardStats } from '@core/services/dashboard.service';
import { LoadingComponent } from '@shared/components/loading/loading.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, LoadingComponent],
  template: `
    <div class="max-w-7xl mx-auto py-10 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Panel de Control</h1>

      <app-loading [isLoading]="isLoading"></app-loading>

      <div *ngIf="!isLoading && stats" class="grid grid-cols-1 gap-6 mb-8">
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-gray-500 text-sm font-medium">Total de Pedidos</h3>
            <p class="text-3xl font-bold text-gray-900 mt-2">{{ stats.totalOrders }}</p>
          </div>
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-gray-500 text-sm font-medium">Pedidos Completados</h3>
            <p class="text-3xl font-bold text-green-500 mt-2">{{ stats.completedOrders }}</p>
          </div>
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-gray-500 text-sm font-medium">Pedidos Pendientes</h3>
            <p class="text-3xl font-bold text-yellow-500 mt-2">{{ stats.pendingOrders }}</p>
          </div>
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-gray-500 text-sm font-medium">Total de Clientes</h3>
            <p class="text-3xl font-bold text-blue-500 mt-2">{{ stats.totalCustomers }}</p>
          </div>
        </div>

        <!-- Revenue Stats -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-gray-500 text-sm font-medium">Ingresos Totales</h3>
            <p class="text-3xl font-bold text-gray-900 mt-2">{{ stats.totalRevenue | currency }}</p>
          </div>
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-gray-500 text-sm font-medium">Ingresos Mensuales</h3>
            <p class="text-3xl font-bold text-gray-900 mt-2">{{ stats.monthlyRevenue | currency }}</p>
          </div>
        </div>
      </div>

      <!-- Charts -->
      <div *ngIf="!isLoading" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Order Status Chart -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-4">Distribución de Estado de Pedidos</h2>
          <div *ngIf="stats" class="space-y-4">
            <div>
              <div class="flex justify-between text-sm mb-1">
                <span class="text-gray-600">Pendientes</span>
                <span class="font-medium">{{ stats.pendingOrders }}</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-yellow-500 h-2 rounded-full" [style.width.%]="(stats.pendingOrders / stats.totalOrders * 100) || 0"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between text-sm mb-1">
                <span class="text-gray-600">Completados</span>
                <span class="font-medium">{{ stats.completedOrders }}</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-green-500 h-2 rounded-full" [style.width.%]="(stats.completedOrders / stats.totalOrders * 100) || 0"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between text-sm mb-1">
                <span class="text-gray-600">Cancelados</span>
                <span class="font-medium">{{ stats.cancelledOrders || 0 }}</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-red-500 h-2 rounded-full" [style.width.%]="((stats.cancelledOrders || 0) / stats.totalOrders * 100) || 0"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Revenue Chart -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-4">Resumen de Ingresos</h2>
          <div *ngIf="stats" class="space-y-4">
            <div class="p-4 bg-blue-50 rounded-lg">
              <p class="text-sm text-gray-600">Ingresos Totales</p>
              <p class="text-2xl font-bold text-blue-600">{{ stats.totalRevenue | currency }}</p>
            </div>
            <div class="p-4 bg-green-50 rounded-lg">
              <p class="text-sm text-gray-600">Ingresos Mensuales</p>
              <p class="text-2xl font-bold text-green-600">{{ stats.monthlyRevenue | currency }}</p>
            </div>
            <div class="p-4 bg-purple-50 rounded-lg">
              <p class="text-sm text-gray-600">Promedio por Pedido</p>
              <p class="text-2xl font-bold text-purple-600">{{ (stats.totalRevenue / (stats.totalOrders || 1)) | currency }}</p>
            </div>
          </div>
        </div>

        <!-- Order Activity Summary -->
        <div class="bg-white rounded-lg shadow p-6 md:col-span-2">
          <h2 class="text-xl font-bold text-gray-900 mb-4">Resumen General</h2>
          <div *ngIf="stats" class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="p-4 border-l-4 border-blue-500 bg-blue-50 rounded">
              <p class="text-sm text-gray-600">Total Pedidos</p>
              <p class="text-2xl font-bold text-blue-600">{{ stats.totalOrders }}</p>
            </div>
            <div class="p-4 border-l-4 border-yellow-500 bg-yellow-50 rounded">
              <p class="text-sm text-gray-600">Tasa Pendiente</p>
              <p class="text-2xl font-bold text-yellow-600">{{ ((stats.pendingOrders / stats.totalOrders * 100) || 0) | number: '1.0-0' }}%</p>
            </div>
            <div class="p-4 border-l-4 border-green-500 bg-green-50 rounded">
              <p class="text-sm text-gray-600">Tasa Finalización</p>
              <p class="text-2xl font-bold text-green-600">{{ ((stats.completedOrders / stats.totalOrders * 100) || 0) | number: '1.0-0' }}%</p>
            </div>
            <div class="p-4 border-l-4 border-purple-500 bg-purple-50 rounded">
              <p class="text-sm text-gray-600">Total Clientes</p>
              <p class="text-2xl font-bold text-purple-600">{{ stats.totalCustomers }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats | null = null;
  isLoading = false;

  constructor(private dashboardService: DashboardService) { }

  ngOnInit() {
    this.loadDashboard();
  }

  loadDashboard() {
    this.isLoading = true;

    this.dashboardService.getStats().subscribe(
      (stats) => {
        this.stats = stats;
        this.updateCharts();
        this.isLoading = false;
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  updateCharts() {
    // Charts disabled - using static display only
  }
}
