import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'product-list',
        pathMatch: 'full'
      },
      {
        path: 'product-list',
        loadComponent: () => import('./pages/product-list-page/product-list-page.component').then(component => component.ProductListPageComponent)
      },
      {
        path: 'product/:id:',
        loadComponent: () => import('./pages/product-page/product-page.component').then(component => component.ProductPageComponent)
      },
      {
        path: 'cart',
        loadComponent: () => import('./pages/cart-page/cart-page.component').then(component => component.CartPageComponent)
      },
];
