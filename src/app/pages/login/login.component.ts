import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  email: any;
  password: any;
  passwordVisible: boolean = false;
  errorMessage: string = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  login() {
    debugger
    if (this.email === 'admin@padaria.com' && this.password === '123456') {
      this.authService.login();
      this.router.navigate(['/']);
    } else {
      // Login inválido
      this.errorMessage = 'Usuário ou senha inválidos';
    }
  }
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
}
