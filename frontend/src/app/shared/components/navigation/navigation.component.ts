import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="bg-blue-600 text-white shadow-lg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <h1 class="text-2xl font-bold">Eduardo Faustos System</h1>
          </div>
          <div class="hidden md:block">
            <div class="ml-10 flex items-baseline space-x-4">
              <a routerLink="/dashboard" routerLinkActive="bg-blue-700" class="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition">Panel</a>
              <a routerLink="/customers" routerLinkActive="bg-blue-700" class="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition">Clientes</a>
              <a routerLink="/orders" routerLinkActive="bg-blue-700" class="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition">Pedidos</a>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-sm">{{ currentUser?.name }}</span>
            <button (click)="logout()" class="bg-red-500 hover:bg-red-700 px-4 py-2 rounded-md text-sm font-medium transition">
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: []
})
export class NavigationComponent implements OnInit {
  currentUser: any;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  logout() {
    this.authService.logout();
    window.location.href = '/auth/login';
  }
}
