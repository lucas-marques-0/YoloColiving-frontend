import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserListPageService } from './user-list-page.service';
import { User } from '../../models/user.interface'

@Component({
  selector: 'app-user-list-page',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './user-list-page.component.html',
  styleUrl: './user-list-page.component.css',
})
export class UserListPageComponent implements OnInit {
  users: User[] = [];

  constructor(private userListPageService: UserListPageService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userListPageService.getUsers().subscribe((data) => {
      this.users = data;
    });
  }
}
