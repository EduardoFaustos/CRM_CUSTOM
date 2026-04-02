import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="bg-white border-t border-gray-200 mt-auto">
      <div class="px-8 py-6">

        <!-- Divider -->
        <div class="border-t border-gray-200 pt-6">
          <div class="flex flex-col md:flex-row justify-between items-center">
            <p class="text-sm text-gray-600">
              &copy; 2026 CRM System. Todos los derechos reservados. 
              <span class="text-gray-400">| Desarrollado por Eduardo Faustos</span>
            </p>
            <div class="flex items-center space-x-6 mt-4 md:mt-0">
              <a href="#" class="text-gray-600 hover:text-blue-600 transition">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20v-7.21H5.5V9.25h2.79V7.16c0-2.76 1.68-4.27 4.15-4.27 1.18 0 2.2.09 2.49.13v2.88h-1.71c-1.34 0-1.6.64-1.6 1.57v2.05h3.2l-4.16 3.54V20z"></path>
                </svg>
              </a>
              <a href="#" class="text-gray-600 hover:text-blue-600 transition">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7z"></path>
                </svg>
              </a>
              <a href="#" class="text-gray-600 hover:text-blue-600 transition">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"></path>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: []
})
export class FooterComponent { }
