import { Component, ElementRef, HostListener, OnDestroy, ViewChild, WritableSignal, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { OperatorFunction, Subscription, combineLatest, debounceTime, filter, tap } from 'rxjs';

import { CartDialogComponent } from '../../pages/cart-dialog/cart-dialog.component';
import { CartService } from '../../services/cart/cart.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ProductModel } from '../../models/product.model';
import { ProductService } from '../../services/product/product.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnDestroy {
  public readonly searchBarFormControl: FormControl<string> = new FormControl('', { nonNullable: true });
  public readonly filteredItems: WritableSignal<ProductModel[]> = signal([]);
  public readonly MIN_CHARACTERS_TO_SEARCH: number = 3;

  public isLoading: boolean = false;
  public showSearchBar: boolean = false;

  @ViewChild('searchBar') public searchBarElement: ElementRef | undefined;

  @HostListener('document:click', ['$event'])
  public onDocumentClick(event: MouseEvent): void {
    if (this.searchBarElement?.nativeElement.contains(event.target)) {
      this.showSearchBar = true;
    } else {
      this.showSearchBar = false;
    }
  }

  private readonly subscription: Subscription = new Subscription();

  public constructor(
    public readonly dialog: MatDialog,
    public readonly snackBar: MatSnackBar,
    private readonly cartService: CartService,
    private readonly productService: ProductService
  ) {
    this.subscription.add(
      combineLatest([
        this.searchBarFormControl.valueChanges.pipe(filter((searchInput) => searchInput.length >= 3)),
        this.productService.products$.pipe(
          filter((value: ProductModel[]): boolean => !!value) as OperatorFunction<ProductModel[] | null, ProductModel[]>
        )
      ])
        .pipe(
          tap(() => (this.isLoading = true)),
          debounceTime(300)
        )
        .subscribe(([searchInput, products]) => {
          const filterItems = products.filter((product) =>
            product.name.toLowerCase().includes(searchInput.toLowerCase())
          );

          this.filteredItems.set(filterItems);
          this.isLoading = false;
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

  public readonly addToCart = (product: ProductModel): void => {
    this.cartService.addToCart(product);
    const snackBarRef = this.snackBar.open('Product added to the cart.', 'Open Cart', { duration: 3000 });

    this.subscription.add(snackBarRef.onAction().subscribe(this.openCart));
  };
}
