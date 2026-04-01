import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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
    return this.http.get<Order[]>(url);
  }

  getOrderById(id: string): Observable<Order> {
    return this.http.get<Order>(`${environment.ordersApiUrl}/orders/${id}`);
  }

  createOrder(request: CreateOrderRequest): Observable<Order> {
    return this.http.post<Order>(`${environment.ordersApiUrl}/orders`, request);
  }

  updateOrder(id: string, request: Partial<Order>): Observable<Order> {
    return this.http.put<Order>(`${environment.ordersApiUrl}/orders/${id}`, request);
  }

  updateOrderStatus(id: string, status: 'pending' | 'completed' | 'cancelled'): Observable<Order> {
    return this.http.patch<Order>(`${environment.ordersApiUrl}/orders/${id}/status`, { status });
  }

  deleteOrder(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.ordersApiUrl}/orders/${id}`);
  }
}
