import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { AlertComponent } from '@shared/components/alert/alert.component';
import { LoadingComponent } from '@shared/components/loading/loading.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, AlertComponent, LoadingComponent],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Crea tu cuenta
          </h2>
        </div>
        
        <app-alert [alert]="alert"></app-alert>
        
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="mt-8 space-y-6">
          <div class="rounded-md shadow-sm space-y-4">
            <div>
              <label for="name">Nombre Completo</label>
              <input
                formControlName="name"
                type="text"
                required
                class="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Nombre completo"
              />
            </div>
            <div>
              <label for="email">Correo electrónico</label>
              <input
                formControlName="email"
                type="email"
                required
                class="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Correo electrónico"
              />
            </div>
            <div>
              <label for="password">Contraseña</label>
              <input
                formControlName="password"
                type="password"
                required
                class="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Contraseña"
              />
            </div>
          </div>

          <app-loading [isLoading]="isLoading" message="Creando cuenta..."></app-loading>

          <div *ngIf="!isLoading">
            <button
              type="submit"
              [disabled]="!form.valid"
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              Registrarse
            </button>
          </div>
        </form>

        <p class="mt-2 text-center text-sm text-gray-600">
          ¿Ya tienes una cuenta?
          <a routerLink="/auth/login" class="font-medium text-blue-600 hover:text-blue-500">
            Inicia sesión aquí
          </a>
        </p>
      </div>
    </div>
  `,
  styles: []
})
export class RegisterComponent implements OnInit {
  form!: FormGroup;
  isLoading = false;
  alert: any = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.isLoading = true;
    this.authService.register(this.form.value).subscribe(
      () => {
        this.router.navigate(['/auth/login']);
      },
      (error) => {
        this.isLoading = false;
        this.alert = {
          type: 'error',
          message: error.error?.message || 'Error al registrar'
        };
      }
    );
  }
}
