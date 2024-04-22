import { Component, OnDestroy, WritableSignal, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { OperatorFunction, Subscription, filter } from 'rxjs';

import { CartDialogComponent } from '../cart-dialog/cart-dialog.component';
import { CartService } from '../../services/cart/cart.service';
import { CommonModule } from '@angular/common';
import { FilterProductsDialogComponent } from './filter-products-dialog/filter-products-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ProductModel } from '../../models/product.model';
import { ProductService } from '../../services/product/product.service';

@Component({
  selector: 'app-product-list-page',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatTooltipModule
  ],
  templateUrl: './product-list-page.component.html',
  styleUrl: './product-list-page.component.scss'
})
export class ProductListPageComponent implements OnDestroy {
  public readonly products: WritableSignal<ProductModel[]> = signal([]);
  private readonly subscription: Subscription = new Subscription();

  public readonly sortByFormControl: FormControl<string> = new FormControl();
  public readonly orderByFormControl: FormControl<string> = new FormControl();

  public readonly sortByTypes = [
    { id: 'name', viewValue: 'Name' },
    { id: 'price', viewValue: 'Price' },
    { id: 'popularity', viewValue: 'Popularity' },
    { id: 'rating', viewValue: 'Rating' }
  ];

  public constructor(
    private readonly cartService: CartService,
    private readonly dialog: MatDialog,
    private readonly snackBar: MatSnackBar,
    private readonly productService: ProductService
  ) {
    this.subscription.add(
      this.productService.products$
        .pipe(
          filter((value: ProductModel[]): boolean => !!value) as OperatorFunction<ProductModel[] | null, ProductModel[]>
        )
        .subscribe({
          next: (products) => {
            this.products.set(products);
          }
        })
    );
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public readonly openCart = (): void => {
    this.dialog.open(CartDialogComponent, {
      width: '960px'
    });
  };

  public readonly openFilterConfiguratorDialog = (): void => {
    this.dialog.open(FilterProductsDialogComponent, {
      width: '350px'
    });
  }

  public readonly addToCart = (product: ProductModel): void => {
    this.cartService.addToCart(product);
    const snackBarRef = this.snackBar.open('Product added to the cart.', 'Open Cart', { duration: 3000 });

    this.subscription.add(
      snackBarRef.onAction().subscribe(() => {
        this.openCart();
      })
    );
  };
}
