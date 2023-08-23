import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { BookingService } from '../../services/booking.service';
import { User } from '../../models/user';
import { Booking } from '../../models/Booking';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  registeredUsers: User[] = [];
  bookings: Booking[] = [];
  registeredUsersback: User[] = [];
  bookingsback: Booking[] = [];

  userColumns: string[] = ['name', 'email'];
  bookingColumns: string[] = ['bookingId', 'date'];

  constructor(private userService: UserService, private bookingService: BookingService) { }

  ngOnInit(): void {
    this.loadRegisteredUsers();
    this.loadBookings();

    // Fetch registered users and bookings from localStorage
    const storedUsers = localStorage.getItem('registeredUsers');
    console.log(storedUsers);
    
    if (storedUsers) {
      this.registeredUsers = JSON.parse(storedUsers);
    }

    const storedBookings = localStorage.getItem('bookings');
    console.log(storedBookings);
    if (storedBookings) {
      this.bookings = JSON.parse(storedBookings);
    }
  }

  loadRegisteredUsers(): void {
    this.userService.getRegisteredUsers().subscribe(response => {
      this.registeredUsersback = response.users;

      // Store registered users in local storage
      if (this.registeredUsersback.length>0) {
        localStorage.setItem('registeredUsers', JSON.stringify(this.registeredUsersback));
      }
    });
  }

  loadBookings(): void {
    this.bookingService.getBookings().subscribe(response => {
      this.bookingsback = response.bookings;

      // Store bookings in local storage
      if (this.bookingsback.length>0) {
        localStorage.setItem('bookings', JSON.stringify(this.bookingsback));
      }
    });
  }
}

