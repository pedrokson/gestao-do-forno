import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../shared/interfaces/user.interface';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-register-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.scss'],
})
export class RegisterUserComponent {
  nome = '';
  email = '';
  senha = '';
  confirmaSenha = '';
  mensagem = '';
  erroSenha = '';

  constructor(
    private userService: UserService,
    public router: Router
  ) {}

  cadastrar(form: NgForm) {
    this.erroSenha = '';
    this.mensagem = '';

    if (form.invalid) {
      this.mensagem = 'Preencha todos os campos corretamente!';
      return;
    }

    if (this.senha !== this.confirmaSenha) {
      this.erroSenha = 'As senhas não conferem!';
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.mensagem = 'Email inválido!';
      return;
    }

    const user: User = {
      nome: this.nome,
      email: this.email,
      senha: this.senha,
    };

    this.userService.create(user).subscribe({
      next: () => {
        this.mensagem = 'Usuário cadastrado com sucesso!';
        this.nome = this.email = this.senha = this.confirmaSenha = '';
        form.resetForm();
      },
      error: (err) => {
        const errorMsg = err.error?.erro || 'Erro desconhecido';
      
        if (errorMsg.includes('UNIQUE constraint failed: usuarios.email')) {
          this.mensagem = 'Este e-mail já está cadastrado.';
        } else {
          this.mensagem = 'Erro ao cadastrar: ' + errorMsg;
        }
      }
    });
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}

