import { BehaviorSubject, Observable } from 'rxjs';

import { CartItemModel } from '../../models/cart.model';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  public readonly cart$: Observable<CartItemModel[]>;
  private readonly _cartBS = new BehaviorSubject<CartItemModel[]>(new Array());

  public constructor() {
    this.cart$ = this._cartBS.asObservable();
  }

  public readonly addToCart = (item: CartItemModel): void => {
    const currentItems = this._cartBS.value;
    const existingItem = currentItems.find((i) => i.id === item.id);

    if (existingItem) {
      existingItem.quantity += item.quantity;
      this._cartBS.next([...currentItems, item]);
    } else {
      this._cartBS.next([...currentItems]);
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
