import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '@core/services/customer.service';
import { EcuadorianDocumentValidationService } from '@core/services/ecuadorian-document-validation.service';
import { AlertComponent } from '@shared/components/alert/alert.component';
import { LoadingComponent } from '@shared/components/loading/loading.component';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, AlertComponent, LoadingComponent],
  template: `
    <div class="max-w-4xl mx-auto py-10 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-6">{{ isEditMode ? 'Editar' : 'Nuevo' }} Cliente</h1>

      <app-alert [alert]="alert"></app-alert>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="bg-white rounded-lg shadow overflow-hidden p-6">
        <div class="grid grid-cols-2 gap-6">
          <!-- Cédula/RUC/Pasaporte (Identificador único ecuatoriano) -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Documento de Identidad *</label>
            <input formControlName="cedula" type="text" placeholder="0123456789" maxlength="13" 
              class="mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border px-3 py-2 text-sm" 
              [ngClass]="form.get('cedula')?.invalid && form.get('cedula')?.touched ? 'border-red-500' : 'border-gray-300'"
              required />
            <p *ngIf="form.get('cedula')?.valid && form.get('cedula')?.touched" class="mt-1 text-sm text-green-600">✓ Documento válido</p>
            <p *ngIf="form.get('cedula')?.invalid && form.get('cedula')?.touched" class="mt-1 text-sm text-red-600">
              <span *ngIf="form.get('cedula')?.errors?.['required']">El documento es requerido</span>
              <span *ngIf="form.get('cedula')?.errors?.['invalidDocument']">{{ form.get('cedula')?.errors?.['invalidDocument'].message }}</span>
              <span *ngIf="form.get('cedula')?.errors?.['invalidCedula']">{{ form.get('cedula')?.errors?.['invalidCedula'].message }}</span>
              <span *ngIf="form.get('cedula')?.errors?.['invalidRuc']">{{ form.get('cedula')?.errors?.['invalidRuc'].message }}</span>
            </p>
            <p class="mt-1 text-xs text-gray-500" [ngSwitch]="form.get('tipo_documento')?.value">
              <span *ngSwitchCase="'Cedula'">Cédula: 10 dígitos numéricos (ej: 0123456789)</span>
              <span *ngSwitchCase="'Ruc'">RUC: 13 dígitos numéricos (ej: 1790085783001)</span>
              <span *ngSwitchCase="'Pasaporte'">Pasaporte: 6-15 caracteres alfanuméricos</span>
            </p>
          </div>

          <!-- Tipo de Documento -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Tipo de Documento *</label>
            <select formControlName="tipo_documento" 
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border px-3 py-2"
              required>
              <option value="Cedula">Cédula de Identidad</option>
              <option value="Ruc">RUC</option>
              <option value="Pasaporte">Pasaporte</option>
            </select>
          </div>

          <!-- Nombre -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Nombre *</label>
            <input formControlName="name" type="text" class="mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border px-3 py-2" 
              [ngClass]="form.get('name')?.invalid && form.get('name')?.touched ? 'border-red-500' : 'border-gray-300'" required />
            <p *ngIf="form.get('name')?.errors?.['serverError']" class="mt-1 text-sm text-red-600">{{ form.get('name')?.errors?.['serverError'] }}</p>
            <p *ngIf="form.get('name')?.errors?.['required'] && form.get('name')?.touched" class="mt-1 text-sm text-red-600">El nombre es requerido</p>
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Email *</label>
            <input formControlName="email" type="email" class="mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border px-3 py-2" 
              [ngClass]="form.get('email')?.invalid && form.get('email')?.touched ? 'border-red-500' : 'border-gray-300'" required />
            <p *ngIf="form.get('email')?.errors?.['serverError']" class="mt-1 text-sm text-red-600">{{ form.get('email')?.errors?.['serverError'] }}</p>
            <p *ngIf="form.get('email')?.errors?.['required'] && form.get('email')?.touched" class="mt-1 text-sm text-red-600">El email es requerido</p>
            <p *ngIf="form.get('email')?.errors?.['email'] && form.get('email')?.touched" class="mt-1 text-sm text-red-600">Ingrese un email válido</p>
          </div>

          <!-- Teléfono -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Teléfono *</label>
            <input formControlName="phone" type="tel" class="mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border px-3 py-2" 
              [ngClass]="form.get('phone')?.invalid && form.get('phone')?.touched ? 'border-red-500' : 'border-gray-300'" required />
            <p *ngIf="form.get('phone')?.errors?.['serverError']" class="mt-1 text-sm text-red-600">{{ form.get('phone')?.errors?.['serverError'] }}</p>
            <p *ngIf="form.get('phone')?.errors?.['required'] && form.get('phone')?.touched" class="mt-1 text-sm text-red-600">El teléfono es requerido</p>
          </div>

          <!-- Dirección -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Dirección *</label>
            <input formControlName="address" type="text" class="mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border px-3 py-2" 
              [ngClass]="form.get('address')?.invalid && form.get('address')?.touched ? 'border-red-500' : 'border-gray-300'" required />
            <p *ngIf="form.get('address')?.errors?.['serverError']" class="mt-1 text-sm text-red-600">{{ form.get('address')?.errors?.['serverError'] }}</p>
            <p *ngIf="form.get('address')?.errors?.['required'] && form.get('address')?.touched" class="mt-1 text-sm text-red-600">La dirección es requerida</p>
          </div>

          <!-- Ciudad -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Ciudad *</label>
            <input formControlName="city" type="text" class="mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border px-3 py-2" 
              [ngClass]="form.get('city')?.invalid && form.get('city')?.touched ? 'border-red-500' : 'border-gray-300'" required />
            <p *ngIf="form.get('city')?.errors?.['serverError']" class="mt-1 text-sm text-red-600">{{ form.get('city')?.errors?.['serverError'] }}</p>
            <p *ngIf="form.get('city')?.errors?.['required'] && form.get('city')?.touched" class="mt-1 text-sm text-red-600">La ciudad es requerida</p>
          </div>

          <!-- Provincia -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Provincia *</label>
            <input formControlName="state" type="text" class="mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border px-3 py-2" 
              [ngClass]="form.get('state')?.invalid && form.get('state')?.touched ? 'border-red-500' : 'border-gray-300'" required />
            <p *ngIf="form.get('state')?.errors?.['serverError']" class="mt-1 text-sm text-red-600">{{ form.get('state')?.errors?.['serverError'] }}</p>
            <p *ngIf="form.get('state')?.errors?.['required'] && form.get('state')?.touched" class="mt-1 text-sm text-red-600">La provincia es requerida</p>
          </div>

          <!-- Código Postal -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Código Postal *</label>
            <input formControlName="zip_code" type="text" class="mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border px-3 py-2" 
              [ngClass]="form.get('zip_code')?.invalid && form.get('zip_code')?.touched ? 'border-red-500' : 'border-gray-300'" required />
            <p *ngIf="form.get('zip_code')?.errors?.['serverError']" class="mt-1 text-sm text-red-600">{{ form.get('zip_code')?.errors?.['serverError'] }}</p>
            <p *ngIf="form.get('zip_code')?.errors?.['required'] && form.get('zip_code')?.touched" class="mt-1 text-sm text-red-600">El código postal es requerido</p>
          </div>
        </div>

        <div class="mt-6">
          <app-loading [isLoading]="isLoading" message="Guardando..."></app-loading>
          <div *ngIf="!isLoading" class="flex gap-4">
            <button type="submit" [disabled]="!form.valid" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md disabled:opacity-50">
              Guardar
            </button>
            <button type="button" (click)="goBack()" class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md">
              Cancelar
            </button>
          </div>
        </div>
      </form>
    </div>
  `,
  styles: []
})
export class CustomerFormComponent implements OnInit {
  form!: FormGroup;
  isEditMode = false;
  isLoading = false;
  alert: any = null;
  customerId: string | null = null;

  constructor(
    private customerService: CustomerService,
    private documentValidationService: EcuadorianDocumentValidationService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      cedula: ['', [Validators.required, this.documentValidationService.cedulaValidator()]],
      tipo_documento: ['Cedula', [Validators.required]],
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      zip_code: ['', [Validators.required]],
    });

    // Observar cambios en tipo_documento para actualizar validación dinámica
    this.form.get('tipo_documento')?.valueChanges.subscribe((docType) => {
      const cedulaControl = this.form.get('cedula');
      if (cedulaControl) {
        cedulaControl.setValidators([
          Validators.required,
          this.documentValidationService.documentValidator(docType)
        ]);
        cedulaControl.updateValueAndValidity();
      }
    });

    this.route.paramMap.subscribe(params => {
      const cedula = params.get('cedula');
      if (cedula) {
        this.isEditMode = true;
        this.customerId = cedula;
        this.loadCustomer(cedula);
        // Deshabilitar cédula en modo edición
        this.form.get('cedula')?.disable();
      }
    });
  }

  loadCustomer(id: string) {
    this.isLoading = true;
    this.customerService.getCustomerById(id).subscribe(
      (customer) => {
        // Primero habilitar cedula para establecer el valor
        this.form.get('cedula')?.enable();
        this.form.patchValue({
          cedula: customer.cedula,
          tipo_documento: customer.tipo_documento,
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          address: customer.address,
          city: customer.city,
          state: customer.state,
          zip_code: customer.zip_code
        });
        // Luego deshabilitar cedula nuevamente
        this.form.get('cedula')?.disable();
        this.isLoading = false;
      },
      () => {
        this.isLoading = false;
        this.alert = { type: 'error', message: 'Error al cargar cliente' };
      }
    );
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.isLoading = true;
    const request = this.form.value;

    const operation = this.isEditMode
      ? this.customerService.updateCustomer(this.customerId!, request)
      : this.customerService.createCustomer(request);

    operation.subscribe(
      () => {
        this.alert = { type: 'success', message: this.isEditMode ? 'Customer updated' : 'Customer created' };
        setTimeout(() => this.router.navigate(['/customers']), 1500);
      },
      (error) => {
        this.isLoading = false;
        
        // Capturar errores del servidor y marcar campos
        if (error.error?.errors) {
          const serverErrors = error.error.errors;
          
          // Marcar campos con errores del servidor
          Object.keys(serverErrors).forEach(fieldName => {
            const control = this.form.get(fieldName);
            if (control) {
              control.setErrors({ 'serverError': serverErrors[fieldName][0] });
              control.markAsTouched();
            }
          });
          
          // Mostrar mensaje general del servidor
          const errorMessage = error.error?.message || 'Error al guardar cliente';
          this.alert = { 
            type: 'error', 
            message: errorMessage,
            details: serverErrors
          };
        } else {
          this.alert = { type: 'error', message: 'Error al guardar cliente' };
        }
      }
    );
  }

  goBack() {
    this.router.navigate(['/customers']);
  }
}
