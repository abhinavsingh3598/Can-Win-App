import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user'; // Adjust the path as needed

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isLoggedIn = false;
  currentUser: User | null = null;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.isAuthenticated.subscribe(
      (authenticated) => {
        this.isLoggedIn = authenticated;
      }
    );
  
    this.authService.currentUser.subscribe(
      (user) => {
        this.currentUser = user;
      }
    );
  
    // Fetch user object from localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
    }
  }
  

  logout(): void {
    this.authService.logout();
  }
}
