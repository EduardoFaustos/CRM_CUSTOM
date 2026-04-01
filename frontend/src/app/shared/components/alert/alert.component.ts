import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Alert {
  id?: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="alert" [ngClass]="getAlertClass()" class="p-4 rounded-md mb-4 flex justify-between items-center">
      <span>{{ alert.message }}</span>
      <button (click)="closeAlert()" class="text-xl font-bold">&times;</button>
    </div>
  `,
  styles: []
})
export class AlertComponent {
  @Input() alert: Alert | null = null;

  getAlertClass(): string {
    switch (this.alert?.type) {
      case 'success':
        return 'bg-green-100 text-green-700 border border-green-400';
      case 'error':
        return 'bg-red-100 text-red-700 border border-red-400';
      case 'warning':
        return 'bg-yellow-100 text-yellow-700 border border-yellow-400';
      case 'info':
        return 'bg-blue-100 text-blue-700 border border-blue-400';
      default:
        return '';
    }
  }

  closeAlert() {
    this.alert = null;
  }
}
