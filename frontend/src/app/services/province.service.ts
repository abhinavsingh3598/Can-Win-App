import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfigService } from './config.service';


export interface Province {
  name: string;
  activeCases: number;
}

export interface City {
  name: string;
  vaccineName: string;
  slots: Slot[];
  locationaddress: string;
}


export interface Availability {
  date: Date;
  slots: Slot[];
}

export interface Slot {
  time: string;
  available: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ProvinceService {

  private apiUrl: string = '';
  constructor(private http: HttpClient,private configService: ConfigService) {
    this.apiUrl = this.configService.get('apiUrl');
   }

  getProvinces(): Observable<Province[]> {
    return this.http.get<{ message: string, provinces: any[] }>(`${this.apiUrl}/api/vaccine/provinces`)
      .pipe(
        map(response => response.provinces.map(provinceData => {
          return {
            name: provinceData.name,
            activeCases: provinceData.activeCases,
          };
        }))
      );
  }



  getCitiesForProvince(provinceName: string): Observable<City[]> {
    const url = `${this.apiUrl}/api/vaccine/province/${provinceName}`;

    return this.http.get<{ message: string, province: { name: string, cities: City[] } }>(url)
      .pipe(
        map(response => response.province.cities)
      );
  }

  updateSlots(cityName: string, slotTime: string, province: string): Observable<any> {
    const url = `${this.apiUrl}/api/vaccine/city/${cityName}/slot`;

    return this.http.put(url, { time: slotTime, provinceName: province })
      .pipe(
        map(response => response)
      );
  }



}
