import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component'; // import RegisterComponent
import { ProvinceStatsComponent } from './components/province-stats/province-stats.component';
import { AdminComponent } from './components/admin/admin.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent }, // add a route for RegisterComponent
  { path: 'province_stats', component: ProvinceStatsComponent },
  { path: 'admin', component: AdminComponent }, 
  { path: '', redirectTo: '/login', pathMatch: 'full' } // redirects to Login if no route is specified
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
