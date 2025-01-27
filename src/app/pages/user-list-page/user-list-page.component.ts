import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserListPageService } from './user-list-page.service';
import { User } from '../../models/user.interface'
import { MatIconModule } from '@angular/material/icon'
import { MatDialogModule } from '@angular/material/dialog'; 
import { MatButtonModule } from '@angular/material/button';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-user-list-page',
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, MatIconModule, MatDialogModule, MatButtonModule],
    templateUrl: './user-list-page.component.html',
    styleUrl: './user-list-page.component.css'
})
export class UserListPageComponent implements OnInit {
  users: User[] = [];

  filteredUsers: User[] = [];
  selectedFilter: string = '';

  isModalVisible = false;
  isEditing = false;  
  currentUser: User = { id: '', Nome: '', Telefone: '', Email: '', Tipo: '', DataDeCadastro: '' }; 

  constructor(private userListPageService: UserListPageService) {}

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    // ATENÇÃO (Opcional): Mudar para a função 'addApiUsersToAws()' caso queira importar a base de dados inicial da API pro AWS (não atualizar a página para não executar denovo).

    this.userListPageService.getUsers().subscribe({
      next: (response) => {
        this.users = response;
        this.filteredUsers = [...this.users];
      },
      error: (erro) => {
        Swal.fire('Erro!', erro.message, 'error'); 
      }
    });
  }

  addUser() {
    if (!this.validateFields()) return; 
    this.currentUser.DataDeCadastro = this.getCurrentDate()
    this.userListPageService.addUser(this.currentUser).subscribe({
      next: (response) => {
        this.getUsers();
        this.closeModal();
        Swal.fire('Sucesso!', response.message, 'success');
      },
      error: (erro) => {
        Swal.fire('Erro!', erro.message, 'error'); 
      }
    });
  }

  deleteUser(userId: string) {
    Swal.fire({
      title: 'Você tem certeza?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
    }).then((result) => {
      if (result.isConfirmed) {
        this.userListPageService.deleteUser(userId).subscribe({
          next: (response) => {
            Swal.fire('Sucesso!', response.message, 'success');
            this.getUsers()
          },
          error: (erro) => {
            Swal.fire('Erro!', erro.message, 'error');
          },
        });
      }
    });
  }

  editUser() {
    if (!this.validateFields()) return; 
    this.userListPageService.editUser(this.currentUser).subscribe({
      next: (response) => {
        this.getUsers();
        this.closeModal();
        Swal.fire('Sucesso!', response.message, 'success');
      },
      error: (erro) => {
        Swal.fire('Erro!', erro.message, 'error');
      },
    });
  }

  filterUsers() {
    if (!this.selectedFilter) this.filteredUsers = [...this.users]; 
    else this.filteredUsers = this.users.filter((user) => user.Tipo === this.selectedFilter);
  }

  clearFilter() {
    this.selectedFilter = '';
    this.filteredUsers = [...this.users]; 
  }

  openModal(user: any = null) {
    if (user) {
      this.isEditing = true;  
      this.currentUser = { ...user };  
    } else {
      this.isEditing = false;  
      this.currentUser = { id: '', Nome: '', Telefone: '', Email: '', Tipo: '', DataDeCadastro: '' };  
    }
    this.isModalVisible = true;
  }

  closeModal() {
    this.isModalVisible = false;
    this.currentUser = { id: '', Nome: '', Telefone: '', Email: '', Tipo: '', DataDeCadastro: '' };   
  }

  getCurrentDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); 
    const day = String(today.getDate()).padStart(2, '0'); 
    return `${year}-${month}-${day}`;
  };

  validateFields(): boolean {
    const { Nome, Telefone, Email, Tipo } = this.currentUser;
    if (!Nome || !Telefone || !Email || !Tipo) {
      Swal.fire({
        title: 'Atenção!',
        text: 'Por favor, preencha todos os campos obrigatórios.',
        icon: 'warning',
      });
      return false;
    }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(Email)) {
      Swal.fire({
        title: 'Atenção!',
        text: 'Por favor, insira um email válido.',
        icon: 'warning',
      });
      return false;
    }
  
    const telefoneRegex = /^\+?\d{0,3}[\s-]?\(?\d{0,2}\)?[\s-]?\d{4,5}[\s-]?\d{4}$/;
    if (!telefoneRegex.test(Telefone)) {
      Swal.fire({
        title: 'Atenção!',
        text: 'Por favor, insira um número de telefone válido.',
        icon: 'warning',
      });
      return false;
    }
  
    return true; 
  }
}
