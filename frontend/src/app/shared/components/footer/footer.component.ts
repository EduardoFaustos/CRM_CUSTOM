import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="bg-gray-800 text-white mt-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="grid grid-cols-3 gap-8">
          <div>
            <h3 class="text-lg font-bold mb-4">Sistema Eduardo Faustos</h3>
            <p class="text-gray-400">Sistema de Gestión de Clientes y Pedidos</p>
          </div>
          <div>
            <h4 class="text-lg font-bold mb-4">Enlaces Rápidos</h4>
            <ul class="text-gray-400 space-y-2">
              <li><a href="#" class="hover:text-white transition">Documentación</a></li>
              <li><a href="#" class="hover:text-white transition">API</a></li>
              <li><a href="#" class="hover:text-white transition">Soporte</a></li>
            </ul>
          </div>
          <div>
            <h4 class="text-lg font-bold mb-4">Contacto</h4>
            <p class="text-gray-400">Correo: eduardofaustos&#64;gmail.com</p>
            <p class="text-gray-400">Teléfono: +1 (555) 123-4567</p>
          </div>
        </div>
        <div class="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2026 Sistema Eduardo Faustos. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  `,
  styles: []
})
export class FooterComponent { }
