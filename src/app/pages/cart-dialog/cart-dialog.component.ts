import { Component, OnDestroy, Signal, WritableSignal, computed, signal } from '@angular/core';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogModule, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { CartItemModel } from '../../models/cart.model';
import { CartService } from '../../services/cart/cart.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cart-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatIconModule, MatButtonModule, MatSnackBarModule, MatTooltipModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent],
  templateUrl: './cart-dialog.component.html',
  styleUrl: './cart-dialog.component.scss'
})
export class CartDialogComponent implements OnDestroy {
  public readonly cart: WritableSignal<CartItemModel[]> = signal([]);
  public readonly totalValue: Signal<number> = computed(() => this.cart().reduce((acc, item) => acc + item.price * item.quantity, 0));
  private readonly subscription: Subscription = new Subscription();

  public constructor(
    public readonly dialogRef: MatDialogRef<CartDialogComponent>,
    private readonly cartService: CartService,
    private readonly snackBar: MatSnackBar
  ) {
    this.subscription.add(
      this.cartService.cart$.subscribe({
        next: (cartItems) => {
          this.cart.set(cartItems);
        }
      })
    );
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public readonly addQuantity = (id: string): void => this.cartService.addProductQuantity(id);
  public readonly removeQuantity = (id: string): void => this.cartService.removeProductQuantity(id);

  public readonly removeProduct = (id: string): void => {
    this.cartService.removeFromCart(id);
    this.snackBar.open('Product removed from the cart.', 'Dismiss', { duration: 3000 });
  };
}
