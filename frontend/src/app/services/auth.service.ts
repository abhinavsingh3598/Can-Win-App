import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http'; // Import HttpClient
import { User } from '../models/user';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfigService } from './config.service';


// Replace with the correct path to your User interface

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl: string = '';

  private _isAuthenticated = new BehaviorSubject(false);
  private _currentUser = new BehaviorSubject<User | null>(null); // Updated type

  get isAuthenticated() {
    return this._isAuthenticated.asObservable();
  }

  get currentUser() {
    return this._currentUser.asObservable();
  }

  constructor(private http: HttpClient,private router: Router,private configService: ConfigService,private snackBar: MatSnackBar) {
    this.apiUrl = this.configService.get('apiUrl');
}



  login(username: string, password: string) {
    this.http.post<any>(`${this.apiUrl}/api/vaccine/user/login`, { username, password }).subscribe({
      next: (response) => {
        // Login successful
        const user = response.user;
        this._isAuthenticated.next(true);
        this._currentUser.next(user);

        // Save user data in local storage
        localStorage.setItem('currentUser', JSON.stringify(user));

        // Navigate to the appropriate component based on user role
        if (user.role === 'admin') {
          this.router.navigate(['/admin']);
        } else if (user.role === 'user') {
          this.router.navigate(['/province_stats']);
        }
      },
      error: (error) => {
        // Login failed
        console.log('Login error:', error);
        this._isAuthenticated.next(false);
        this._currentUser.next(null);
        this.snackBar.open('Invalid username or password', 'Close', {
          duration: 3000,
        });
      }
    });
  }



  logout() {

    // logout logic here...
    this._isAuthenticated.next(false);
    this._currentUser.next(null);
    // Clear local storage
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }
}

