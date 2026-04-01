import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { AlertComponent } from '@shared/components/alert/alert.component';
import { LoadingComponent } from '@shared/components/loading/loading.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, AlertComponent, LoadingComponent],
  template: `
    <main class="h-screen flex flex-row overflow-hidden">
      <!-- Left side - Carousel/Slider -->
      <div class="w-1/2 bg-white relative hidden lg:flex flex-col">
        <!-- Carousel placeholder -->
        <div class="flex-1 relative bg-white rounded-lg shadow-md" style="background-image: url('https://tyttrack.torresytorres.com/img/slides/slide-01.png'); background-position: top right; background-size: cover; background-repeat: no-repeat;"></div>
        
        <!-- Bottom text -->
        <h3 class="absolute bottom-8 left-0 right-0 text-center font-bold text-2xl">
          <span class="text-[#20AAE2]">Crecer</span>
          <span class="text-[#006AB2] font-normal"> es lo que logramos juntos</span>
        </h3>
      </div>

      <!-- Right side - Login Form -->
      <div class="flex-1 flex flex-col items-center justify-center bg-white lg:w-1/2 px-6 lg:px-12">
        <!-- Logo -->
        <div class="mb-8">
          <img src="https://tyttrack.torresytorres.com/_next/image?url=%2Fimg%2Flogo-torres-torres.png&w=1080&q=75" alt="Logo Torres&Torres" class="h-12 w-auto">
        </div>

        <!-- Title -->
        <h5 class="text-[#003663] font-bold text-lg mb-6">Inicio de sesión</h5>

        <!-- Alert -->
        <div class="w-full max-w-md mb-6">
          <app-alert [alert]="alert"></app-alert>
        </div>

        <!-- Form -->
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="w-full max-w-md space-y-6">
          <!-- Email Field -->
          <div class="w-full">
            <label for="email" class="block text-sm font-medium text-[#5B5B5B] mb-2">
              Correo <span class="text-red-500">*</span>
            </label>
            <input
              id="email"
              formControlName="email"
              type="email"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-md outline-none transition-colors focus:border-[#006AB2] focus:border-2"
              placeholder="Correo"
            />
            <div *ngIf="form.get('email')?.invalid && form.get('email')?.touched" class="text-red-500 text-xs mt-1">
              Email requerido
            </div>
          </div>

          <!-- Password Field -->
          <div class="w-full">
            <label for="password" class="block text-sm font-medium text-[#5B5B5B] mb-2">
              Contraseña <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <input
                id="password"
                formControlName="password"
                [type]="showPassword ? 'text' : 'password'"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-md outline-none transition-colors focus:border-[#006AB2] focus:border-2"
                placeholder="Contraseña"
              />
              <button
                type="button"
                (click)="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <svg *ngIf="!showPassword" class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                </svg>
                <svg *ngIf="showPassword" class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.81-2.88 3.69-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46A11.804 11.804 0 001 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm2.31-3.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3-.05 0-.11 0-.17.02z"/>
                </svg>
              </button>
            </div>
            <div *ngIf="form.get('password')?.invalid && form.get('password')?.touched" class="text-red-500 text-xs mt-1">
              Contraseña requerida
            </div>
          </div>

          <!-- Remember & Forgot Password -->
          <div class="flex items-center justify-between">
            <label class="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                formControlName="remember"
                class="w-4 h-4 text-[#20AAE2] rounded focus:ring-[#20AAE2] accent-[#20AAE2]"
              />
              <span class="text-sm text-[#5B5B5B]">Recordar mis datos</span>
            </label>
            <a href="#" class="text-sm text-[#20AAE2] hover:text-[#006AB2] underline transition-colors">
              Olvidé mi contraseña
            </a>
          </div>

          <!-- Loading & Submit -->
          <div class="pt-4">
            <app-loading *ngIf="isLoading" [isLoading]="isLoading" message="Iniciando sesión..."></app-loading>
            
            <button
              *ngIf="!isLoading"
              type="submit"
              [disabled]="!form.valid"
              class="w-full py-3 px-8 bg-[#006AB2] text-white font-medium rounded-full hover:bg-[#003663] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#006AB2] disabled:opacity-50 transition-colors"
            >
              Iniciar sesión
            </button>
          </div>
        </form>
      </div>
    </main>
  `,
  styles: []
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  isLoading = false;
  alert: any = null;
  showPassword = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      remember: [false]
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.isLoading = true;
    this.authService.login(this.form.value).subscribe(
      () => {
        this.router.navigate(['/dashboard']);
      },
      (error) => {
        this.isLoading = false;
        this.alert = {
          type: 'error',
          message: error.error?.message || 'Error al iniciar sesión'
        };
      }
    );
  }
}
