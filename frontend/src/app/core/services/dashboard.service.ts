import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

export interface DashboardStats {
  totalOrders: number;
  completedOrders: number;
  pendingOrders: number;
  cancelledOrders: number;
  totalCustomers: number;
  activeCustomers: number;
  totalRevenue: number;
  monthlyRevenue: number;
}

export interface ChartData {
  labels: string[];
  data: number[];
  title: string;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) { }

  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${environment.ordersApiUrl}/dashboard/stats`);
  }

  getOrderActivityChart(): Observable<ChartData> {
    return this.http.get<ChartData>(`${environment.ordersApiUrl}/dashboard/order-activity`);
  }

  getRevenueChart(): Observable<ChartData> {
    return this.http.get<ChartData>(`${environment.ordersApiUrl}/dashboard/revenue`);
  }

  getOrderStatusChart(): Observable<any> {
    return this.http.get<any>(`${environment.ordersApiUrl}/dashboard/order-status`);
  }
}
