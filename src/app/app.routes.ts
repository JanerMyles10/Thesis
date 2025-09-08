import { Routes } from '@angular/router';
import { Homepage } from './components/homepage/homepage';
import { Sellerpage } from './components/sellerpage/sellerpage';
export const routes: Routes = [

  {path: '', component: Homepage},
  {path: 'seller', component: Sellerpage}
];
