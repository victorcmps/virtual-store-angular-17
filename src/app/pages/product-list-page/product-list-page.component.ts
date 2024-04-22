import { Component, OnDestroy, WritableSignal, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { OperatorFunction, Subscription, combineLatest, filter, startWith } from 'rxjs';

import { CartDialogComponent } from '../cart-dialog/cart-dialog.component';
import { CartService } from '../../services/cart/cart.service';
import { CommonModule } from '@angular/common';
import { FilterFormModel } from '../../models/filter-form.model';
import { FilterProductsDialogComponent } from './filter-products-dialog/filter-products-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { OrderByTypesEnum } from '../../enums/order-by-types.enum';
import { ProductModel } from '../../models/product.model';
import { ProductService } from '../../services/product/product.service';
import { SortTypesEnum } from '../../enums/sort-by-types.enum';

@Component({
  selector: 'app-product-list-page',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTooltipModule,
    ReactiveFormsModule
  ],
  templateUrl: './product-list-page.component.html',
  styleUrl: './product-list-page.component.scss'
})
export class ProductListPageComponent implements OnDestroy {
  public readonly sortByTypes = [
    { id: SortTypesEnum.Name, viewValue: 'Name', type: String },
    { id: SortTypesEnum.Price, viewValue: 'Price', type: Number },
    { id: SortTypesEnum.Popularity, viewValue: 'Popularity', type: Number },
    { id: SortTypesEnum.Rating, viewValue: 'Rating', type: Number }
  ];

  public readonly orderByTypes = [
    { id: OrderByTypesEnum.Ascending, viewValue: 'Ascending' },
    { id: OrderByTypesEnum.Descending, viewValue: 'Descending' }
  ];

  public readonly products: WritableSignal<ProductModel[]> = signal([]);
  public readonly sortByFormControl: FormControl<SortTypesEnum> = new FormControl(SortTypesEnum.Popularity, {
    nonNullable: true
  });
  public readonly orderByFormControl: FormControl<string> = new FormControl(OrderByTypesEnum.Descending, {
    nonNullable: true
  });

  public readonly filterFormControl: FormControl<FilterFormModel | null> = new FormControl({
    minPrice: null,
    maxPrice: null,
    minRating: null,
    maxRating: null,
    minPopularity: null,
    maxPopularity: null
  });

  private readonly subscription: Subscription = new Subscription();

  public constructor(
    private readonly cartService: CartService,
    private readonly dialog: MatDialog,
    private readonly snackBar: MatSnackBar,
    private readonly productService: ProductService
  ) {
    this.subscription.add(
      combineLatest([
        this.productService.products$.pipe(
          filter((value: ProductModel[]): boolean => !!value) as OperatorFunction<ProductModel[] | null, ProductModel[]>
        ),
        this.sortByFormControl.valueChanges.pipe(startWith(SortTypesEnum.Popularity)),
        this.orderByFormControl.valueChanges.pipe(startWith(OrderByTypesEnum.Descending))
      ]).subscribe({
        next: ([products, sortBy, orderBy]: [ProductModel[], SortTypesEnum, string]) => {
          const sortedProducts = products.sort((a, b) => this.sortProducts(a, b, sortBy));

          if (orderBy === 'desc') {
            sortedProducts.reverse();
          }

          this.products.set(sortedProducts);
        }
      })
    );

    this.subscription.add(
      combineLatest([
        this.filterFormControl.valueChanges,
        this.productService.products$.pipe(
          filter((value: ProductModel[]): boolean => !!value) as OperatorFunction<ProductModel[] | null, ProductModel[]>
        )
      ]).subscribe(([filter, products]: [FilterFormModel | null, ProductModel[]]) => {
        if (filter) {
          const filteredProducts = products.filter((product) => {
            return (
              (filter.minPrice == null || product.price >= filter.minPrice) &&
              (filter.maxPrice == null || product.price <= filter.maxPrice) &&
              (filter.minRating == null || product.rating >= filter.minRating) &&
              (filter.maxRating == null || product.rating <= filter.maxRating) &&
              (filter.minPopularity == null || product.popularity >= filter.minPopularity) &&
              (filter.maxPopularity == null || product.popularity <= filter.maxPopularity)
            );
          });
          this.products.set(filteredProducts);
          this.snackBar.open('Products filtered.', 'Close', { duration: 3000 });
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
    this.dialog
      .open(FilterProductsDialogComponent, {
        width: '600px',
        data: {
          formGroup: this.filterFormControl.value
        }
      })
      .afterClosed()
      .subscribe((filterConfig: FilterFormModel) => this.filterFormControl.setValue(filterConfig));
  };

  public readonly addToCart = (product: ProductModel): void => {
    this.cartService.addToCart(product);
    const snackBarRef = this.snackBar.open('Product added to the cart.', 'Open Cart', { duration: 3000 });

    this.subscription.add(
      snackBarRef.onAction().subscribe(() => {
        this.openCart();
      })
    );
  };

  private readonly sortProducts = (a: ProductModel, b: ProductModel, sortBy: SortTypesEnum): number => {
    if (sortBy === SortTypesEnum.Name) {
      return a[sortBy].localeCompare(b[sortBy]);
    }

    return a[sortBy] - b[sortBy];
  };
}
