import { Routes } from '@angular/router';
import { ProductsComponent } from './pages/products/products.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { RegisterUserComponent } from './pages/register-user/register-user.component';
import { SalesComponent } from './pages/sales/sales.component';
import { ReportsComponent } from './pages/reports/reports.component';

      
export const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'products', component: ProductsComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register-user', component: RegisterUserComponent },
    { path: 'sales', component: SalesComponent, canActivate: [AuthGuard] },
    { path: 'reports', component: ReportsComponent, canActivate: [AuthGuard] },
]; 
