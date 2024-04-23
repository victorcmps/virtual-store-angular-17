import { Observable, catchError, of, share } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductModel } from '../../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  public readonly products$: Observable<ProductModel[] | null>;

  public constructor(
    public readonly snackBar: MatSnackBar,
    private readonly http: HttpClient
  ) {
    this.products$ = this.http.get<ProductModel[]>('beers').pipe(share(), catchError(this.handleGetProductsError));
  }

  private readonly handleGetProductsError = (): Observable<null> => {
    this.snackBar.open('An error occurred while fetching the products.', 'Dismiss');
    return of(null);
  };
}
