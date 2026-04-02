import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardService, DashboardStats } from '@core/services/dashboard.service';
import { LoadingComponent } from '@shared/components/loading/loading.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingComponent],
  template: `
    <div class="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Panel de Control</h1>
            <p class="mt-2 text-sm text-gray-600">Bienvenido de vuelta. Aquí está tu resumen de negocio.</p>
          </div>
          <!-- Date Range Filter -->
          <div class="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-2">
            <select [(ngModel)]="selectedPeriod" (change)="onPeriodChange()" class="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="today">Hoy</option>
              <option value="week">Esta semana</option>
              <option value="month">Este mes</option>
              <option value="year">Este año</option>
              <option value="all">Todo</option>
            </select>
          </div>
        </div>
      </div>

      <app-loading [isLoading]="isLoading"></app-loading>

      <div *ngIf="!isLoading && stats" class="space-y-6">
        <!-- KPI Cards Grid -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <!-- Card 1: Total Customers -->
          <div class="bg-white rounded-lg shadow p-6 border-t-4 border-blue-500">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600 mb-2">Total de Clientes</p>
                <p class="text-3xl font-bold text-gray-900">{{ stats.totalCustomers | number }}</p>
                <p class="text-xs text-gray-500 mt-2">
                  <span class="text-green-600 font-semibold">↑ 11.01%</span> desde el mes anterior
                </p>
              </div>
              <div class="bg-blue-100 rounded-full p-4">
                <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10a3 3 0 11-6 0 3 3 0 016 0zM15 20H9m6 0h6"></path>
                </svg>
              </div>
            </div>
          </div>

          <!-- Card 2: Total Orders -->
          <div class="bg-white rounded-lg shadow p-6 border-t-4 border-orange-500">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600 mb-2">Total de Pedidos</p>
                <p class="text-3xl font-bold text-gray-900">{{ stats.totalOrders | number }}</p>
                <p class="text-xs text-gray-500 mt-2">
                  <span class="text-red-600 font-semibold">↓ 9.05%</span> desde el mes anterior
                </p>
              </div>
              <div class="bg-orange-100 rounded-full p-4">
                <svg class="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                </svg>
              </div>
            </div>
          </div>

          <!-- Card 3: Revenue -->
          <div class="bg-white rounded-lg shadow p-6 border-t-4 border-green-500">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600 mb-2">Ingresos Totales</p>
                <p class="text-3xl font-bold text-gray-900">{{ stats.totalRevenue | currency:'USD':'symbol':'1.0-0' }}</p>
                <p class="text-xs text-gray-500 mt-2">
                  <span class="text-green-600 font-semibold">↑ 12.5%</span> desde el mes anterior
                </p>
              </div>
              <div class="bg-green-100 rounded-full p-4">
                <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
          </div>

          <!-- Card 4: Completion Rate -->
          <div class="bg-white rounded-lg shadow p-6 border-t-4 border-purple-500">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600 mb-2">Tasa de Finalización</p>
                <p class="text-3xl font-bold text-gray-900">{{ (stats.totalOrders > 0 ? (stats.completedOrders / stats.totalOrders * 100) : 0) | number:'1.0-0' }}%</p>
                <p class="text-xs text-gray-500 mt-2">
                  <span class="text-green-600 font-semibold">↑ 2.3%</span> desde la semana anterior
                </p>
              </div>
              <div class="bg-purple-100 rounded-full p-4">
                <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Charts Row 1 -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Order Status Distribution -->
          <div class="lg:col-span-2 bg-white rounded-lg shadow p-6">
            <div class="flex items-center justify-between mb-6">
              <div>
                <h3 class="text-lg font-bold text-gray-900">Distribución de Pedidos</h3>
                <p class="text-sm text-gray-600 mt-1">Desglose por estado</p>
              </div>
            </div>

            <div class="space-y-5">
              <!-- Pending -->
              <div>
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center">
                    <span class="inline-flex items-center justify-center h-3 w-3 rounded-full mr-2 bg-yellow-400"></span>
                    <span class="text-sm font-medium text-gray-700">Pendientes</span>
                  </div>
                  <span class="text-sm font-bold text-gray-900">{{ stats.pendingOrders }}</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5">
                  <div class="bg-yellow-400 h-2.5 rounded-full transition-all duration-300" [style.width.%]="(stats.totalOrders > 0 ? stats.pendingOrders / stats.totalOrders * 100 : 0)"></div>
                </div>
                <p class="text-xs text-gray-500 mt-1">{{ (stats.totalOrders > 0 ? stats.pendingOrders / stats.totalOrders * 100 : 0) | number:'1.0-0' }}% del total</p>
              </div>

              <!-- Completed -->
              <div>
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center">
                    <span class="inline-flex items-center justify-center h-3 w-3 rounded-full mr-2 bg-green-500"></span>
                    <span class="text-sm font-medium text-gray-700">Completados</span>
                  </div>
                  <span class="text-sm font-bold text-gray-900">{{ stats.completedOrders }}</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5">
                  <div class="bg-green-500 h-2.5 rounded-full transition-all duration-300" [style.width.%]="(stats.totalOrders > 0 ? stats.completedOrders / stats.totalOrders * 100 : 0)"></div>
                </div>
                <p class="text-xs text-gray-500 mt-1">{{ (stats.totalOrders > 0 ? stats.completedOrders / stats.totalOrders * 100 : 0) | number:'1.0-0' }}% del total</p>
              </div>

              <!-- Cancelled -->
              <div>
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center">
                    <span class="inline-flex items-center justify-center h-3 w-3 rounded-full mr-2 bg-red-500"></span>
                    <span class="text-sm font-medium text-gray-700">Cancelados</span>
                  </div>
                  <span class="text-sm font-bold text-gray-900">{{ stats.cancelledOrders || 0 }}</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5">
                  <div class="bg-red-500 h-2.5 rounded-full transition-all duration-300" [style.width.%]="(stats.totalOrders > 0 ? (stats.cancelledOrders || 0) / stats.totalOrders * 100 : 0)"></div>
                </div>
                <p class="text-xs text-gray-500 mt-1">{{ (stats.totalOrders > 0 ? (stats.cancelledOrders || 0) / stats.totalOrders * 100 : 0) | number:'1.0-0' }}% del total</p>
              </div>
            </div>
          </div>

          <!-- Monthly Target -->
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center justify-between mb-6">
              <div>
                <h3 class="text-lg font-bold text-gray-900">Meta Mensual</h3>
                <p class="text-sm text-gray-600 mt-1">Objetivo establecido</p>
              </div>
            </div>

            <div class="flex items-center justify-center">
              <div class="relative w-40 h-40">
                <svg class="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                  <!-- Background circle -->
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#E5E7EB" stroke-width="8"></circle>
                  <!-- Progress circle -->
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#3B82F6" stroke-width="8" 
                    [style.strokeDasharray]="'314.159'"
                    [style.strokeDashoffset]="314.159 * (1 - (stats.completedOrders / stats.totalOrders || 0))"
                    stroke-linecap="round"></circle>
                </svg>
                <div class="absolute inset-0 flex items-center justify-center">
                  <div class="text-center">
                    <p class="text-2xl font-bold text-gray-900">{{ (stats.totalOrders > 0 ? stats.completedOrders / stats.totalOrders * 100 : 0) | number:'1.0-0' }}%</p>
                    <p class="text-xs text-gray-500">Progreso</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-6 space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Meta:</span>
                <span class="font-bold text-gray-900">{{ stats.totalOrders | number }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Completado:</span>
                <span class="font-bold text-green-600">{{ stats.completedOrders | number }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Restante:</span>
                <span class="font-bold text-yellow-600">{{ (stats.totalOrders - stats.completedOrders) | number }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Charts Row 2 -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Revenue Summary -->
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center justify-between mb-6">
              <div>
                <h3 class="text-lg font-bold text-gray-900">Resumen de Ingresos</h3>
                <p class="text-sm text-gray-600 mt-1">Análisis financiero</p>
              </div>
            </div>

            <div class="space-y-4">
              <div class="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-xs font-medium text-blue-600 mb-1">INGRESOS TOTALES</p>
                    <p class="text-2xl font-bold text-blue-900">{{ stats.totalRevenue | currency:'USD':'symbol':'1.0-0' }}</p>
                  </div>
                  <svg class="w-10 h-10 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
                  </svg>
                </div>
              </div>

              <div class="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-xs font-medium text-green-600 mb-1">INGRESOS MENSUALES</p>
                    <p class="text-2xl font-bold text-green-900">{{ stats.monthlyRevenue | currency:'USD':'symbol':'1.0-0' }}</p>
                  </div>
                  <svg class="w-10 h-10 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.16 2.75a.75.75 0 00-1.32 0l-3.816 9.26a.75.75 0 00.616 1.115H7.25v3.75a.75.75 0 001.5 0v-3.75h3.816a.75.75 0 00.616-1.115L8.16 2.75z"></path>
                  </svg>
                </div>
              </div>

              <div class="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-xs font-medium text-purple-600 mb-1">PROMEDIO POR PEDIDO</p>
                    <p class="text-2xl font-bold text-purple-900">{{ ((stats.totalRevenue / (stats.totalOrders || 1)) || 0) | currency:'USD':'symbol':'1.0-0' }}</p>
                  </div>
                  <svg class="w-10 h-10 text-purple-300" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.5 1.5H5.75A2.75 2.75 0 003 4.25v11A2.75 2.75 0 005.75 18h8.5A2.75 2.75 0 0017 15.25v-11A2.75 2.75 0 0014.25 1.5h-3.75m0 3.5h3.75m-7.5 0h3.75M5.5 10h9m-9 2.5h9"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Key Metrics -->
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center justify-between mb-6">
              <div>
                <h3 class="text-lg font-bold text-gray-900">Indicadores Clave</h3>
                <p class="text-sm text-gray-600 mt-1">Desempeño general</p>
              </div>
            </div>

            <div class="space-y-4">
              <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p class="text-sm font-medium text-gray-700">Tasa de Pendencia</p>
                  <p class="text-xs text-gray-500 mt-1">Órdenes aún no completadas</p>
                </div>
                <div class="text-right">
                  <p class="text-2xl font-bold text-yellow-600">{{ (stats.totalOrders > 0 ? stats.pendingOrders / stats.totalOrders * 100 : 0) | number:'1.0-0' }}%</p>
                </div>
              </div>

              <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p class="text-sm font-medium text-gray-700">Tasa de Finalización</p>
                  <p class="text-xs text-gray-500 mt-1">Órdenes completadas exitosamente</p>
                </div>
                <div class="text-right">
                  <p class="text-2xl font-bold text-green-600">{{ (stats.totalOrders > 0 ? stats.completedOrders / stats.totalOrders * 100 : 0) | number:'1.0-0' }}%</p>
                </div>
              </div>

              <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p class="text-sm font-medium text-gray-700">Tasa de Cancelación</p>
                  <p class="text-xs text-gray-500 mt-1">Órdenes canceladas</p>
                </div>
                <div class="text-right">
                  <p class="text-2xl font-bold text-red-600">{{ (stats.totalOrders > 0 ? (stats.cancelledOrders || 0) / stats.totalOrders * 100 : 0) | number:'1.0-0' }}%</p>
                </div>
              </div>

              <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p class="text-sm font-medium text-gray-700">Promedio Mensual</p>
                  <p class="text-xs text-gray-500 mt-1">Órdenes por mes</p>
                </div>
                <div class="text-right">
                  <p class="text-2xl font-bold text-blue-600">{{ ((stats.totalOrders / 12) || 0) | number:'1.0-0' }}</p>
                </div>
              </div>
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
  selectedPeriod = 'month';

  constructor(private dashboardService: DashboardService) { }

  ngOnInit() {
    this.loadDashboard();
  }

  onPeriodChange() {
    this.loadDashboard();
  }

  loadDashboard() {
    this.isLoading = true;

    this.dashboardService.getStats().subscribe(
      (stats: DashboardStats) => {
        this.stats = stats;
        this.isLoading = false;
      },
      (error: any) => {
        console.error('Error loading dashboard stats:', error);
        this.isLoading = false;
      }
    );
  }
}
