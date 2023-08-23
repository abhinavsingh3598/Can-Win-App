import { Booking } from "../models/Booking";

export interface BookingResponse {
    message: string;
    bookings: Booking[];
  }
  