// user.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';
import { Observable } from 'rxjs';
import { UserResponse } from '../interfaces/UserResponse';
import { ConfigService } from './config.service';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  

  private apiUrl: string = '';
  constructor(private http: HttpClient,private configService: ConfigService) {
    this.apiUrl = this.configService.get('apiUrl');
   }
 
  register(user: User) {
    return this.http.post(`${this.apiUrl}/api/vaccine/user/register`, user);
  }
 
  
  
  getRegisteredUsers(): Observable<UserResponse> { // Corrected method name and return type
    return this.http.get<UserResponse>(`${this.apiUrl}/api/vaccine/admin/users`);
  }
}




 
