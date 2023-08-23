import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Booking } from '../models/Booking';
import { BookingResponse } from '../interfaces/BookingResponse';
import { environment } from '../../environments/environment';
import { ConfigService } from './config.service';




@Injectable({
  providedIn: 'root'
})
export class BookingService {
  
  private apiUrl: string = '';
  constructor(private http: HttpClient,private configService: ConfigService) {
    this.apiUrl = this.configService.get('apiUrl');
   }


  createBooking(booking: Booking) : Observable<any>{
    return this.http.post(`${this.apiUrl}/api/vaccine/user/booking`, booking);
  }


  getBookings(): Observable<BookingResponse> { // Corrected return type
    return this.http.get<BookingResponse>(`${this.apiUrl}/api/vaccine/admin/bookings`);
  }
}
