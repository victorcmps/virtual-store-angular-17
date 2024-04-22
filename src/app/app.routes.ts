import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'product-list',
    pathMatch: 'full'
  },
  {
    path: 'product-list',
    loadComponent: () =>
      import('./pages/product-list-page/product-list-page.component').then(
        (component) => component.ProductListPageComponent
      )
  }
];
