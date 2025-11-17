import { Routes } from '@angular/router';
import { Homepage } from './components/homepage/homepage';
import { Cart } from './components/cart/cart';
import { Register } from './components/register/register';
import { Login } from './components/login/login';
import { Homeproducts } from './components/homeproducts/homeproducts';
import { Mypurchases } from './components/mypurchases/mypurchases';
import { Sellerpage } from './components/sellerpage/sellerpage';
import { Dashboard } from './components/sellerpage/dashboard/dashboard';
import { Orders } from './components/sellerpage/orders/orders';
import { Products } from './components/sellerpage/products/products';
import { Reports } from './components/sellerpage/reports/reports';
import { AuthGuard } from './authguard/login-guard';

export const routes: Routes = [

  { path: '', component: Homepage },
  {path: 'cart',  component: Cart},
  {path: 'login',  component: Login},
  {path: 'reg',  component: Register},
  {path: 'mypurchases',  component: Mypurchases},
   {
      path: 'seller',
      component: Sellerpage,
      children: [
        { path: 'dash', component: Dashboard },
        { path: 'orders', component: Orders },
        { path: 'prod', component: Products},
        { path: 'report', component: Reports}
      ]
    },
  { path: 'homeprod', component: Homeproducts, canActivate: [AuthGuard] },
];
