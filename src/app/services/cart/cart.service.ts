import { BehaviorSubject, Observable } from 'rxjs';

import { CartItemModel } from '../../models/cart.model';
import { Injectable } from '@angular/core';
import { ProductModel } from '../../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  public readonly cart$: Observable<CartItemModel[]>;
  private readonly _cartBS = new BehaviorSubject<CartItemModel[]>([]);

  public constructor() {
    this.cart$ = this._cartBS.asObservable();
  }

  public readonly addToCart = (item: ProductModel): void => {
    const currentItems: CartItemModel[] = this._cartBS.value;
    const existingItemIndex = currentItems.findIndex((i) => i.id === item.id);

    if (existingItemIndex !== -1) {
      currentItems[existingItemIndex].quantity++;
      this._cartBS.next(currentItems);
    } else {
      const newItem = { ...item, quantity: 1 };
      this._cartBS.next([...currentItems, newItem]);
    }
  };

  public readonly removeFromCart = (itemId: string): void => {
    const cartItems = this._cartBS.value;
    const updatedCart = cartItems.filter((cart) => cart.id !== itemId);
    this._cartBS.next(updatedCart);
  };

  public readonly addProductQuantity = (itemId: string): void => this.updateProductQuantity(itemId, 'ADD');

  public readonly removeProductQuantity = (itemId: string): void => this.updateProductQuantity(itemId, 'REMOVE');

  private readonly updateProductQuantity = (itemId: string, operation: 'ADD' | 'REMOVE'): void => {
    const cartItems = this._cartBS.value;
    const updatedCart = cartItems.map((item) =>
      item.id === itemId
        ? {
            ...item,
            quantity: operation === 'ADD' ? item.quantity + 1 : item.quantity - 1
          }
        : item
    );

    this._cartBS.next(updatedCart);
  };
}
