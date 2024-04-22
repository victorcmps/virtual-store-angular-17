/* eslint-disable @typescript-eslint/no-explicit-any */

import { CartItemModel } from '../../models/cart.model';
import { CartService } from './cart.service';

describe('CartService', () => {
  let cartService: CartService;

  beforeEach(() => {
    cartService = new CartService();
  });

  describe('addToCart', () => {
    it('should add item to cart', (done) => {
      // Arrange
      const item: any = { id: '1', name: 'Product 1', price: 10 };

      // Act
      cartService.addToCart(item);

      // Assert
      cartService.cart$.subscribe((cartItems: CartItemModel[]) => {
        expect(cartItems.length).toBe(1);
        expect(cartItems[0].id).toBe(item.id);
        expect(cartItems[0].quantity).toBe(1);
        done();
      });
    });

    it('should increment quantity when adding existing item to cart', (done) => {
      // Arrange
      const item: any = { id: '1', name: 'Product 1', price: 10 };

      // Act
      cartService.addToCart(item);
      cartService.addToCart(item);

      // Assert
      cartService.cart$.subscribe((cartItems: CartItemModel[]) => {
        expect(cartItems.length).toBe(1);
        expect(cartItems[0].id).toBe(item.id);
        expect(cartItems[0].quantity).toBe(2);
        done();
      });
    });
  });

  describe('removeFromCart', () => {
    it('should remove item from cart', (done) => {
      // Arrange
      const item: any = { id: '1', name: 'Product 1', price: 10 };

      // Act
      cartService.addToCart(item);
      cartService.removeFromCart(item.id);

      // Assert
      cartService.cart$.subscribe((cartItems: CartItemModel[]) => {
        expect(cartItems.length).toBe(0);
        done();
      });
    });
  });

  describe('addProductQuantity', () => {
    it('should increment product quantity', (done) => {
      // Arrange
      const item: any = { id: '1', name: 'Product 1', price: 10 };
      const diffItem: any = { id: '2', name: 'Product 2', price: 10 };

      // Act
      cartService.addToCart(item);
      cartService.addProductQuantity(item.id);

      cartService.addToCart(diffItem);
      cartService.addProductQuantity(diffItem.id);

      // Assert
      cartService.cart$.subscribe((cartItems: CartItemModel[]) => {
        expect(cartItems.length).toBe(2);
        expect(cartItems[0].id).toBe(item.id);
        expect(cartItems[0].quantity).toBe(2);
        expect(cartItems[1].id).toBe(diffItem.id);
        expect(cartItems[1].quantity).toBe(2);
        done();
      });
    });
  });

  describe('removeProductQuantity', () => {
    it('should decrement product quantity', (done) => {
      // Arrange
      const item: any = { id: '1', name: 'Product 1', price: 10 };

      // Act
      cartService.addToCart(item);
      cartService.addProductQuantity(item.id);
      cartService.removeProductQuantity(item.id);

      // Assert
      cartService.cart$.subscribe((cartItems: CartItemModel[]) => {
        expect(cartItems.length).toBe(1);
        expect(cartItems[0].id).toBe(item.id);
        expect(cartItems[0].quantity).toBe(1);
        done();
      });
    });
  });
});
