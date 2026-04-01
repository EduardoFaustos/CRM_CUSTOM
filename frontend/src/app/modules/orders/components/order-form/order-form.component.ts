import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '@core/services/order.service';
import { CustomerService, Customer } from '@core/services/customer.service';
import { AlertComponent } from '@shared/components/alert/alert.component';
import { LoadingComponent } from '@shared/components/loading/loading.component';

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, AlertComponent, LoadingComponent],
  template: `
    <div class="max-w-4xl mx-auto py-10 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-6">{{ isEditMode ? 'Editar' : 'Nuevo' }} Pedido</h1>

      <app-alert [alert]="alert"></app-alert>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="bg-white rounded-lg shadow overflow-hidden p-6">
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700">Cliente *</label>
          <div class="relative">
            <input 
              type="text" 
              [(ngModel)]="customerSearchQuery"
              [ngModelOptions]="{standalone: true}"
              (input)="onCustomerSearch($event)"
              placeholder="Buscar por cédula o nombre..." 
              class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
            
            <div *ngIf="customerSearchQuery && filteredCustomers.length > 0" class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
              <div *ngFor="let customer of filteredCustomers" 
                (click)="selectCustomer(customer)"
                class="px-3 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100">
                <div class="font-medium text-gray-900">{{ customer.name }}</div>
                <div class="text-sm text-gray-500">Cédula: {{ customer.cedula }}</div>
              </div>
            </div>

            <div *ngIf="selectedCustomer" class="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
              <p class="text-sm"><strong>Seleccionado:</strong> {{ selectedCustomer.name }} ({{ selectedCustomer.cedula }})</p>
            </div>
          </div>
        </div>

        <div class="mb-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Artículos del Pedido</h3>
          <div formArrayName="items" class="space-y-4">
            <div *ngFor="let item of getItems().controls; let i = index" [formGroupName]="i" class="border border-gray-200 rounded-md p-4">
              <div class="grid grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Nombre del Producto</label>
                  <input formControlName="productName" type="text" class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Cantidad</label>
                  <input formControlName="quantity" type="number" class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Precio Unitario</label>
                  <input formControlName="unitPrice" type="number" class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2" />
                </div>
              </div>
              <button type="button" (click)="removeItem(i)" class="mt-2 text-red-600 hover:text-red-900">Eliminar Artículo</button>
            </div>
          </div>
          <button type="button" (click)="addItem()" class="mt-4 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md">
            + Agregar Artículo
          </button>
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
export class OrderFormComponent implements OnInit {
  form!: FormGroup;
  customers: Customer[] = [];
  filteredCustomers: Customer[] = [];
  selectedCustomer: Customer | null = null;
  customerSearchQuery: string = '';
  isEditMode = false;
  isLoading = false;
  alert: any = null;
  orderId: string | null = null;

  constructor(
    private orderService: OrderService,
    private customerService: CustomerService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      customerId: ['', [Validators.required]],
      items: this.fb.array([this.createItemFormGroup()], [Validators.required])
    });

    this.loadCustomers();

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.orderId = params['id'];
        this.loadOrder(params['id']);
      }
    });
  }

  createItemFormGroup(): FormGroup {
    return this.fb.group({
      productName: ['', [Validators.required]],
      quantity: [1, [Validators.required, Validators.min(1)]],
      unitPrice: [0, [Validators.required, Validators.min(0)]]
    });
  }

  getItems(): FormArray {
    return this.form.get('items') as FormArray;
  }

  addItem() {
    this.getItems().push(this.createItemFormGroup());
  }

  removeItem(index: number) {
    this.getItems().removeAt(index);
  }

  loadCustomers() {
    this.customerService.getCustomers().subscribe(
      (data) => {
        this.customers = data;
      },
      () => {
        this.alert = { type: 'error', message: 'Failed to load customers' };
      }
    );
  }

  onCustomerSearch(event: any) {
    const query = this.customerSearchQuery.toLowerCase();
    if (!query) {
      this.filteredCustomers = [];
      return;
    }
    
    this.filteredCustomers = this.customers.filter(customer =>
      customer.name.toLowerCase().includes(query) ||
      customer.cedula.toLowerCase().includes(query)
    );
  }

  selectCustomer(customer: Customer) {
    this.selectedCustomer = customer;
    this.form.patchValue({ customerId: customer.cedula });
    this.customerSearchQuery = '';
    this.filteredCustomers = [];
  }

  loadOrder(id: string) {
    this.isLoading = true;
    this.orderService.getOrderById(id).subscribe(
      (order) => {
        this.form.patchValue({ customerId: order.customerId });
        
        // Buscar y establecer el cliente seleccionado
        const customer = this.customers.find(c => c.cedula === order.customerId);
        if (customer) {
          this.selectedCustomer = customer;
        }
        
        const itemsArray = this.getItems();
        itemsArray.clear();
        order.items.forEach(item => {
          itemsArray.push(this.fb.group({
            productName: [item.productName],
            quantity: [item.quantity],
            unitPrice: [item.unitPrice]
          }));
        });
        this.isLoading = false;
      },
      () => {
        this.isLoading = false;
        this.alert = { type: 'error', message: 'Error al cargar pedido' };
      }
    );
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.isLoading = true;
    const request = this.form.value;

    const operation = this.isEditMode
      ? this.orderService.updateOrder(this.orderId!, request)
      : this.orderService.createOrder(request);

    operation.subscribe(
      () => {
        this.alert = { type: 'success', message: this.isEditMode ? 'Order updated' : 'Order created' };
        setTimeout(() => this.router.navigate(['/orders']), 1500);
      },
      () => {
        this.isLoading = false;
        this.alert = { type: 'error', message: 'Error al guardar pedido' };
      }
    );
  }

  goBack() {
    this.router.navigate(['/orders']);
  }
}
