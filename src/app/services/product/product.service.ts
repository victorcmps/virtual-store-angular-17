import { Observable, catchError, of } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductModel } from '../../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  public readonly products$: Observable<ProductModel[] | null>;

  public constructor(private readonly http: HttpClient) {
    this.products$ = this.http.get<ProductModel[]>('beers').pipe(catchError(this.handleGetProductsError));
  }

  private readonly handleGetProductsError = (): Observable<null> => {
    return of(null);
  };
}
