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

  getUsers(): Observable<User[]> {
    return this.http.post<User[]>(`${this.API_URL}/users`, {});
  }
}
