/* eslint-disable @typescript-eslint/no-explicit-any */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CartDialogComponent } from './cart-dialog.component';
import { CartService } from '../../services/cart/cart.service';
import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { of } from 'rxjs';

describe('CartDialogComponent', () => {
  let component: CartDialogComponent;
  let fixture: ComponentFixture<CartDialogComponent>;
  let cartServiceSpy: jasmine.SpyObj<CartService>;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        CommonModule,
        MatDialogModule,
        MatIconModule,
        MatButtonModule,
        MatSnackBarModule,
        MatTooltipModule,
        HttpClientTestingModule
      ],

      providers: [
        {
          provide: CartService,
          useValue: jasmine.createSpyObj(
            'CartService',
            ['addProductQuantity', 'removeProductQuantity', 'removeFromCart'],
            {
              cart$: of([{ name: 'Budweiser', price: 2.99 }])
            }
          )
        },
        { provide: MatDialogRef, useValue: jasmine.createSpyObj('MatDialogRef', ['close']) },
        {  provide: MatSnackBar, useValue: jasmine.createSpyObj('MatSnackBar', ['open']) }
      ]
    }).compileComponents();

    cartServiceSpy = TestBed.inject(CartService) as jasmine.SpyObj<CartService>;

    fixture = TestBed.createComponent(CartDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });


  describe('addProductQuantity', () => {
    it('should call cartService.addProductQuantity when addQuantity is called', () => {
      // Arrange
      const id = 'product-id';
  
      // Act
      component.addQuantity(id);
  
      // Assert
      expect(cartServiceSpy.addProductQuantity).toHaveBeenCalledWith(id);
    });
  })

  describe('removeProductQuantity', () => {
    it('should call cartService.removeProductQuantity when removeQuantity is called', () => {
      // Arrange
      const id = 'product-id';
      
      // Act
      component.removeQuantity(id);
      
      // Assert
      expect(cartServiceSpy.removeProductQuantity).toHaveBeenCalledWith(id);
    });
  });

  describe('removeProduct', () => {
    it('should call cartService.removeFromCart when removeProduct is called', () => {
      // Arrange
      const id = 'product-id';
      
      // Act
      component.removeProduct(id);
  
      // Assert
      expect(cartServiceSpy.removeFromCart).toHaveBeenCalledWith(id);
    });
  })
});
