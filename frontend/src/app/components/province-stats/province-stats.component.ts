import { Component, OnInit } from '@angular/core';
import { Province, ProvinceService } from '../../services/province.service'; // adjust the path as needed
import { MatDialog } from '@angular/material/dialog';
import { BookingComponent } from '../booking/booking.component';

@Component({
  selector: 'app-province-stats',
  templateUrl: './province-stats.component.html',
  styleUrls: ['./province-stats.component.css']
})
export class ProvinceStatsComponent implements OnInit {
  // in province.component.ts
provinces: Province[] = [];
filteredProvinces: Province[] = [];
  searchValue: string = '';

  constructor(private provinceService: ProvinceService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.provinceService.getProvinces().subscribe((provinces) => {
      this.provinces = provinces;
      console.log(provinces);
      this.filteredProvinces = provinces;
    });
    
    
  }

  onSearchChange(): void {
    if (this.searchValue) {
      this.filteredProvinces = this.provinces.filter(province =>
        province.name.toLowerCase().startsWith(this.searchValue.toLowerCase())
      );
    } else {
      this.filteredProvinces = this.provinces;
    }
  }
  
  bookSlot(provinceName: string | undefined): void {
    const dialogRef = this.dialog.open(BookingComponent, {
      height:'650px',
      width: '550px',
      // width: '80%',
      data: {province: provinceName}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
