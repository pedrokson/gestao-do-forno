import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  email: any;
  password: any;
  passwordVisible: boolean = false;
  errorMessage: string = '';

  constructor(private router: Router, private authService: AuthService) {}

  login() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Preencha todos os campos!';
      return;
    }

    this.authService.login(this.email, this.password).subscribe({
      next: (res) => {
        if (res.token) {
          localStorage.setItem('token', res.token);
          const payLoadBase64 = res.token.split('.')[1];
          const payload = JSON.parse(atob(payLoadBase64));
          localStorage.setItem('userId', payload.id);
          this.router.navigate(['/']);
        } else {
          this.errorMessage = 'Email ou senha inválidos!';
        }
      },
      error: (err) => {
        this.errorMessage = 'Email ou senha inválidos!';
      },
    });
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  navigateToRegister() {
    this.router.navigate(['/register-user']);
  }
}
