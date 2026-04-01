import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { OrdersListComponent } from './components/orders-list/orders-list.component';
import { OrderDetailComponent } from './components/order-detail/order-detail.component';
import { OrderFormComponent } from './components/order-form/order-form.component';

const routes: Routes = [
  { path: '', component: OrdersListComponent },
  { path: 'new', component: OrderFormComponent },
  { path: ':id', component: OrderDetailComponent },
  { path: ':id/edit', component: OrderFormComponent },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    OrdersListComponent,
    OrderDetailComponent,
    OrderFormComponent
  ]
})
export class OrdersModule { }
