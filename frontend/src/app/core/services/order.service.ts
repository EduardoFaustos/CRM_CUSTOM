import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '@environments/environment';

export interface Order {
  id: string;
  customerId: string;
  orderNumber: string;
  status: 'pending' | 'completed' | 'cancelled';
  totalAmount: number;
  items: OrderItem[];
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface CreateOrderRequest {
  customerId: string;
  items: {
    productName: string;
    quantity: number;
    unitPrice: number;
  }[];
}

export interface FilterOrdersRequest {
  status?: string;
  customerId?: string;
  startDate?: Date;
  endDate?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }

  private normalizeOrder(data: any): Order {
    return {
      id: data.id,
      customerId: data.cedula || data.customerId,
      orderNumber: data.order_number || data.orderNumber,
      status: data.status,
      totalAmount: parseFloat(data.total_amount) || data.totalAmount,
      items: (data.items || data.order_items || []).map((item: any) => ({
        id: item.id,
        productName: item.product_name || item.productName,
        quantity: item.quantity,
        unitPrice: parseFloat(item.unit_price) || item.unitPrice,
        total: parseFloat(item.total) || item.total
      })),
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      completedAt: data.completed_at ? new Date(data.completed_at) : undefined
    };
  }

  getOrders(filters?: FilterOrdersRequest): Observable<Order[]> {
    let params = new URLSearchParams();
    if (filters) {
      if (filters.status) params.append('status', filters.status);
      if (filters.customerId) params.append('customerId', filters.customerId);
      if (filters.startDate) params.append('startDate', filters.startDate.toISOString());
      if (filters.endDate) params.append('endDate', filters.endDate.toISOString());
    }
    const queryString = params.toString();
    const url = queryString ? `${environment.ordersApiUrl}/orders?${queryString}` : `${environment.ordersApiUrl}/orders`;
    return this.http.get<any[]>(url).pipe(
      map(orders => orders.map(order => this.normalizeOrder(order)))
    );
  }

  getOrderById(id: string): Observable<Order> {
    return this.http.get<any>(`${environment.ordersApiUrl}/orders/${id}`).pipe(
      map(order => this.normalizeOrder(order))
    );
  }

  createOrder(request: CreateOrderRequest): Observable<Order> {
    // Normalizar camelCase a snake_case para el backend
    const normalizedRequest = {
      customer_id: request.customerId,
      items: request.items.map(item => ({
        product_name: item.productName,
        quantity: item.quantity,
        unit_price: item.unitPrice
      }))
    };
    return this.http.post<any>(`${environment.ordersApiUrl}/orders`, normalizedRequest).pipe(
      map(order => this.normalizeOrder(order))
    );
  }

  updateOrder(id: string, request: Partial<Order>): Observable<Order> {
    // Normalizar camelCase a snake_case para el backend
    const normalizedRequest: any = {};
    if (request.customerId) normalizedRequest.customer_id = request.customerId;
    if (request.items) {
      normalizedRequest.items = request.items.map(item => ({
        product_name: item.productName,
        quantity: item.quantity,
        unit_price: item.unitPrice
      }));
    }
    return this.http.put<any>(`${environment.ordersApiUrl}/orders/${id}`, normalizedRequest).pipe(
      map(order => this.normalizeOrder(order))
    );
  }

  updateOrderStatus(id: string, status: 'pending' | 'completed' | 'cancelled'): Observable<Order> {
    return this.http.patch<any>(`${environment.ordersApiUrl}/orders/${id}/status`, { status }).pipe(
      map(order => this.normalizeOrder(order))
    );
  }

  deleteOrder(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.ordersApiUrl}/orders/${id}`);
  }
}
