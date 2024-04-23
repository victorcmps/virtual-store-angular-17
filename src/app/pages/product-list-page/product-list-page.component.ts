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

  public loading = true;
  public readonly products: WritableSignal<ProductModel[]> = signal([]);
  public readonly sortByFormControl: FormControl<SortTypesEnum> = new FormControl(SortTypesEnum.Popularity, {
    nonNullable: true
  });
  public readonly orderByFormControl: FormControl<string> = new FormControl(OrderByTypesEnum.Descending, {
    nonNullable: true
  });

  public readonly filterFormControl: FormControl<FilterFormModel | null> = new FormControl({
    value: {
      minPrice: null,
      maxPrice: null,
      minRating: null,
      maxRating: null,
      minPopularity: null,
      maxPopularity: null
    },
    disabled: true
  });

  private readonly subscription: Subscription = new Subscription();

  public constructor(
    public readonly dialog: MatDialog,
    public readonly snackBar: MatSnackBar,
    private readonly cartService: CartService,
    private readonly productService: ProductService
  ) {
    this.subscription.add(
      this.productService.products$
        .pipe(
          filter((value: ProductModel[]): boolean => !!value) as OperatorFunction<ProductModel[] | null, ProductModel[]>
        )
        .subscribe({
          next: (products: ProductModel[]) => {
            this.loading = false;
            this.products.set(products);
          }
        })
    );

    this.subscription.add(
      combineLatest([
        this.sortByFormControl.valueChanges.pipe(startWith(SortTypesEnum.Popularity)),
        this.orderByFormControl.valueChanges.pipe(startWith(OrderByTypesEnum.Descending))
      ]).subscribe({
        next: ([sortBy, orderBy]: [SortTypesEnum, string]) => {
          const sortedProducts = this.products().sort((a, b) => this.sortProducts(a, b, sortBy));

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
        }
      })
    );
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public readonly openCart = (): void => {
    this.dialog.open(CartDialogComponent, {
      width: '480px'
    });
  };

  public readonly openFilterConfiguratorDialog = (): void => {
    this.subscription.add(
      this.dialog
        .open(FilterProductsDialogComponent, {
          width: '600px',
          data: {
            formGroup: this.filterFormControl.value
          }
        })
        .afterClosed()
        .subscribe((filterConfig: FilterFormModel) => {
          if (filterConfig) {
            if (this.filterFormControl.disabled) {
              this.filterFormControl.enable();
            }

            if (Object.values(filterConfig).every((value) => value === null || value === '')) {
              this.cleanAllFilters();
              return;
            }

            this.filterFormControl.setValue(filterConfig);
            this.snackBar.open('Products filtered.', 'Close', { duration: 3000 });
          }
        })
    );
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

  public readonly cleanAllFilters = (): void => {
    this.filterFormControl.setValue({
      minPrice: null,
      maxPrice: null,
      minRating: null,
      maxRating: null,
      minPopularity: null,
      maxPopularity: null
    });

    this.filterFormControl.disable();
    this.snackBar.open('Product filters have been reset to default.', 'Close', { duration: 3000 });
  };

  private readonly sortProducts = (a: ProductModel, b: ProductModel, sortBy: SortTypesEnum): number => {
    if (sortBy === SortTypesEnum.Name) {
      return a[sortBy].localeCompare(b[sortBy]);
    }

    return a[sortBy] - b[sortBy];
  };
}
