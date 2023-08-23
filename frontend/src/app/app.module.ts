import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './components/header/header.component';
import { HttpClientModule } from '@angular/common/http';
import { ProvinceStatsComponent } from './components/province-stats/province-stats.component';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table'; // Import this
import { MatFormFieldModule } from '@angular/material/form-field';
import { BookingComponent } from './components/booking/booking.component'; // Import this
import { MatDialogModule } from '@angular/material/dialog';
// Angular Material Components
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { AdminComponent } from './components/admin/admin.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { ConfigService } from './services/config.service';
import { APP_INITIALIZER } from '@angular/core';
import { lastValueFrom } from 'rxjs';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HeaderComponent,
    ProvinceStatsComponent,
    BookingComponent,
    AdminComponent
   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    MatTableModule, // Declare here
    MatFormFieldModule, // Declare here
    MatDialogModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,  
    MatSnackBarModule
    // MatFileUploadModule,
  ],
  providers: [
    ConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: (configService: ConfigService) => () => lastValueFrom(configService.loadConfig()),
      deps: [ConfigService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
