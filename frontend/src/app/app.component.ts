import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { map } from 'rxjs/operators';
import { NavigationComponent } from './shared/components/navigation/navigation.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule, NavigationComponent, FooterComponent],
  template: `
    <app-navigation *ngIf="isAuthenticated$ | async"></app-navigation>
    <main class="flex-grow">
      <router-outlet></router-outlet>
    </main>
    <app-footer *ngIf="isAuthenticated$ | async"></app-footer>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
  `]
})
export class AppComponent implements OnInit {
  isAuthenticated$: any;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    // Observable that checks if there's a valid token
    this.isAuthenticated$ = this.authService.currentUser$.pipe(
      map(() => {
        if (typeof localStorage !== 'undefined') {
          return !!localStorage.getItem('token');
        }
        return false;
      })
    );
  }
}
