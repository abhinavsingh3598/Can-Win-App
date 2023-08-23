import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { City, ProvinceService } from 'src/app/services/province.service';
import { BookingService } from 'src/app/services/booking.service';
import { Booking } from 'src/app/models/Booking';
import { User } from 'src/app/models/user';

export interface DialogData {
  province: string;
}

@Component({
  selector: 'app-booking-dialog',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {
  cities: City[] = [];
  bookings: Booking[] = [];
  selectedCity: City | undefined;
  selectedDate: Date = new Date();
  user: User|undefined;

  constructor(
    public dialogRef: MatDialogRef<BookingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private provinceService: ProvinceService,
    private bookingService: BookingService
  ) { }

  ngOnInit(): void {
    // Retrieve user data from local storage
    const savedUser = localStorage.getItem('currentUser');
    console.log(savedUser);
    
    if (savedUser) {
      const user = JSON.parse(savedUser);
      this.user=user;
    }

    this.provinceService.getCitiesForProvince(this.data.province).subscribe((cities) => {
      this.cities = cities;
      this.selectedCity = cities[0];
    });
  }

  isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate();
  }

  bookSlot(time: string): void {

// console.log(this.user.);

const booking: Booking = {
  username: this.user?.username || '',
  userEmail: this.user?.email.toString() || '',
  firstName: this.user?.firstName || '',
  lastName: this.user?.lastName || '',
  city: this.selectedCity?.name || '',
  centerId: '1', // This should be the real id of the center
  location: this.selectedCity?.locationaddress || '', // location of the selected city
  vaccinationName: this.selectedCity?.vaccineName || '', // vaccinationName of the city 
  date: this.selectedDate,
  phoneNum:this.user?.phoneNum.toString() || '',
  slot: time,
};


    this.bookingService.createBooking(booking).subscribe({
      next: (response) => {
        this.bookings = response.bookings;
        alert(response.message);
  
        this.provinceService.updateSlots(this.selectedCity?.name || '', time,this.data.province).subscribe({
          next: (response) => {
            console.log('slot updated');
            
          },
          error: (error) => {
            console.log('Failed to update slot', error);
            alert('Failed to update slot. Please try again.');
          }
        });
      },
      error: (error) => {
        console.log('Failed to register user', error);
        alert('Failed to create booking. Please try again.');
      }
    });



    this.dialogRef.close();
  }
}

