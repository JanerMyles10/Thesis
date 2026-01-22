import { Routes } from '@angular/router';

// --- YOUR COMPONENT IMPORTS ---
import { Homepage } from './components/homepage/homepage';
import { Cart } from './components/cart/cart';
import { Register } from './components/register/register';
import { Login } from './components/login/login';
import { Homeproducts } from './components/homeproducts/homeproducts';
import { Mypurchases } from './components/mypurchases/mypurchases';
import { CreateShopComponent } from './components/create_shop/create-shop'; // Using short name to be consistent
import { Sellerpage } from './components/sellerpage/sellerpage';
import { Dashboard } from './components/sellerpage/dashboard/dashboard';
import { Orders } from './components/sellerpage/orders/orders';
import { Products } from './components/sellerpage/products/products';
import { Reports } from './components/sellerpage/reports/reports';
import { AuthGuard } from './authguard/login-guard';
import { SettingsComponent } from './components/sellerpage/settings/settings';
import { Profile } from './components/profile/profile';


// --- ADMIN IMPORTS ---
import { AdminDashboard } from './components/admin-dashboard/admin-dashboard';
import { AdminShopApp } from './components/admin-shop-app/admin-shop-app'; // Changed folder name for consistency
import { AdminShopManagement } from './components/admin-shop-management/admin-shop-management';
import { SellerGuard } from './authguard/seller-guard';

export const routes: Routes = [
  { path: '', component: Homepage },
  { path: 'cart',  component: Cart },
  { path: 'login',  component: Login },
  { path: 'reg',  component: Register },
  { path: 'mypurchases',  component: Mypurchases },
  { path: 'create-shop', component: CreateShopComponent }, // Using short name
  { path: 'homeprod', component: Homeproducts, canActivate: [AuthGuard] },
  { path: 'profile', component: Profile },

  {
    path: 'seller',
    component: Sellerpage, canActivate: [SellerGuard],
    children: [
      { path: 'dash', component: Dashboard },
      { path: 'orders', component: Orders },
      { path: 'prod', component: Products },
      { path: 'report', component: Reports },
      { path: 'settings', component: SettingsComponent }
    ]
  },

  { path: 'admin-dashboard', component: AdminDashboard },
  { path: 'admin-shop-app', component: AdminShopApp },
  { path: 'admin-shops', component: AdminShopManagement },
];
