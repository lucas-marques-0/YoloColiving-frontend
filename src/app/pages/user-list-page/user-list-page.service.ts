import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../models/user.interface';

@Injectable({
  providedIn: 'root'
})

export class UserListPageService {
  private API_URL = 'http://localhost:3333';

  constructor(private http: HttpClient) {}

  addApiUsersToAws(): Observable<User[]> {
    return this.http.post<User[]>(`${this.API_URL}/users`, {});
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.API_URL}/users`);
  }

  addUser(user: User): Observable<User[]> {
    return this.http.post<User[]>(`${this.API_URL}/users`, user);
  }

  deleteUser(userId: string): Observable<any> {
    return this.http.delete<any>(`${this.API_URL}/users/${userId}`);
  }

  editUser(user: User): Observable<any> {
    return this.http.put<any>(`${this.API_URL}/users/${user.id}`, user);
  }
}
