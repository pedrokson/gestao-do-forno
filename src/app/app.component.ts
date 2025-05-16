import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {

  isSidebarCollapsed = false;
  constructor(public router: Router, private authService: AuthService) {}

  public isPublicRoute(): boolean {
    return ['/login', '/register-user'].includes(this.router.url);
  }
  
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  
  navigateToHome() {
    this.router.navigate(['/home']); // Altere para a rota desejada
  }
  
  navigateToDashboard() {
    this.router.navigate(['/']); // Agora leva para a tela inicial
  }
  
  navigateToProducts() {
    this.router.navigate(['/products']);
  }
  
  navigateToSales() {
    this.router.navigate(['/sales']);
  }
  
  navigateToReport() {
    this.router.navigate(['/reports']);
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
}
