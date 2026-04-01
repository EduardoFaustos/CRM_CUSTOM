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
          <p class="text-gray-500">Se requiere configuración de módulo para mostrar gráfico</p>
        </div>

        <!-- Revenue Chart -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-4">Ingresos Mensuales</h2>
          <p class="text-gray-500">Se requiere configuración de módulo para mostrar gráfico</p>
        </div>

        <!-- Order Activity Chart -->
        <div class="bg-white rounded-lg shadow p-6 md:col-span-2">
          <h2 class="text-xl font-bold text-gray-900 mb-4">Actividad de Pedidos (Últimos 30 días)</h2>
          <p class="text-gray-500">Se requiere configuración de módulo para mostrar gráfico</p>
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
