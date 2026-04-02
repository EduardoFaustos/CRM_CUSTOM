import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { map } from 'rxjs/operators';
import { FooterComponent } from './shared/components/footer/footer.component';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule, FooterComponent],
  template: `
    <div *ngIf="isAuthenticated$ | async" class="flex h-screen bg-gray-50">
      <!-- Sidebar -->
      <aside class="w-64 bg-white shadow-lg fixed h-screen">
        <!-- Logo -->
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-lg">CRM</span>
            </div>
            <div>
              <h1 class="text-lg font-bold text-gray-900">CRM System</h1>
              <p class="text-xs text-gray-500">Eduardo Faustos</p>
            </div>
          </div>
        </div>

        <!-- Navigation Menu -->
        <nav class="mt-8 px-4">
          <ul class="space-y-2">
            <!-- Dashboard -->
            <li>
              <a routerLink="/dashboard" routerLinkActive="bg-blue-50 border-r-4 border-blue-600 text-blue-600"
                class="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors group">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9m-9 16l-7-4m0 0l-2-1m16 1l7-4m0 0l2-1m-2 1v-5a1 1 0 00-1-1h-12a1 1 0 00-1 1v5m18-4l-7 4"></path>
                </svg>
                <span class="font-medium">Panel de Control</span>
              </a>
            </li>

            <!-- Customers -->
            <li>
              <a routerLink="/customers" routerLinkActive="bg-blue-50 border-r-4 border-blue-600 text-blue-600"
                class="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors group">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10a3 3 0 11-6 0 3 3 0 016 0zM15 20H9m6 0h6"></path>
                </svg>
                <span class="font-medium">Clientes</span>
              </a>
            </li>

            <!-- Orders -->
            <li>
              <a routerLink="/orders" routerLinkActive="bg-blue-50 border-r-4 border-blue-600 text-blue-600"
                class="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors group">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                </svg>
                <span class="font-medium">Pedidos</span>
              </a>
            </li>
          </ul>
        </nav>

        <!-- Divider -->
        <div class="border-t border-gray-200 my-6"></div>

        <!-- User Section -->
        <div class="px-4 pb-6">
          <div class="bg-gray-50 rounded-lg p-4 mb-4">
            <div class="flex items-center space-x-3 mb-4">
              <div class="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                {{ (currentUser?.name || 'U')?.charAt(0).toUpperCase() }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">{{ currentUser?.name || 'Usuario' }}</p>
                <p class="text-xs text-gray-500 truncate">{{ currentUser?.email }}</p>
              </div>
            </div>
            <button (click)="logout()" class="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
              <span>Cerrar sesión</span>
            </button>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <div class="ml-64 flex-1 flex flex-col">
        <!-- Header -->
        <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
          <div class="px-8 py-4 flex items-center justify-between">
            <div>
              <h2 class="text-2xl font-bold text-gray-900">Bienvenido</h2>
              <p class="text-sm text-gray-500 mt-1">{{ getGreeting() }}</p>
            </div>
            <div class="flex items-center space-x-4">
              <!-- Search -->
              <div class="hidden md:flex items-center bg-gray-100 rounded-lg px-4 py-2">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
                <input type="text" placeholder="Buscar..." class="ml-2 bg-transparent outline-none text-sm text-gray-700" />
              </div>

              <!-- Notifications -->
              <button class="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                </svg>
                <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <!-- User Menu -->
              <button class="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                <div class="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {{ (currentUser?.name || 'U')?.charAt(0).toUpperCase() }}
                </div>
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                </svg>
              </button>
            </div>
          </div>
        </header>

        <!-- Content -->
        <main class="flex-1 overflow-auto">
          <router-outlet></router-outlet>
        </main>

        <!-- Footer -->
        <app-footer></app-footer>
      </div>
    </div>

    <!-- Auth pages (without sidebar) -->
    <div *ngIf="!(isAuthenticated$ | async)" class="flex-1">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      height: 100vh;
    }
  `]
})
export class AppComponent implements OnInit {
  isAuthenticated$: any;
  currentUser: any;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    // Observable that checks if there's a valid token
    this.isAuthenticated$ = this.authService.currentUser$.pipe(
      map(() => {
        if (typeof localStorage !== 'undefined') {
          return !!localStorage.getItem('token');
        }
        return false;
      })
    );

    // Subscribe to current user
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  }

  logout() {
    this.authService.logout();
    window.location.href = '/auth/login';
  }
}
