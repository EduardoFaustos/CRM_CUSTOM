import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { CustomersListComponent } from './components/customers-list/customers-list.component';
import { CustomerDetailComponent } from './components/customer-detail/customer-detail.component';
import { CustomerFormComponent } from './components/customer-form/customer-form.component';

const routes: Routes = [
  { path: '', component: CustomersListComponent },
  { path: 'new', component: CustomerFormComponent },
  { path: ':id', component: CustomerDetailComponent },
  { path: ':id/edit', component: CustomerFormComponent },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    CustomersListComponent,
    CustomerDetailComponent,
    CustomerFormComponent
  ]
})
export class CustomersModule { }
