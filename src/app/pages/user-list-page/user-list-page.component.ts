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

  isModalVisible = false;
  isEditing = false;  
  editUserId: string = '';
  currentUser: User = { id: '', Nome: '', Telefone: '', Email: '', Tipo: '', DataDeCadastro: '' };  

  constructor(private userListPageService: UserListPageService) {}

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.userListPageService.getUsers().subscribe((data) => {
      this.users = data;
    });
  }

  addUser() {
    this.currentUser.DataDeCadastro = this.getCurrentDate()
    this.userListPageService.addUser(this.currentUser).subscribe((data) => {
      this.getUsers()
      this.closeModal()
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
            console.log(erro)
            const errorMsg = erro.error?.message || 'Erro ao excluir o usuário.';
            Swal.fire('Erro!', errorMsg, 'error');
          },
        });
      }
    });
  }

  editUser() {
    this.userListPageService.editUser(this.currentUser).subscribe(() => {
      this.getUsers();
      this.closeModal();
    });
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
}
