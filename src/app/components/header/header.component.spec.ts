/* eslint-disable @typescript-eslint/no-explicit-any */

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { CartDialogComponent } from '../../pages/cart-dialog/cart-dialog.component';
import { CartService } from '../../services/cart/cart.service';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ProductService } from '../../services/product/product.service';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let cartServiceSpy: jasmine.SpyObj<CartService>;

  const mockProducts = [
    { id: '2', name: 'Product B', price: 5, rating: 1, popularity: 4 },
    { id: '3', name: 'Product C', price: 10, rating: 2, popularity: 3 },
    { id: '1', name: 'Product A', price: 15, rating: 3, popularity: 2 },
    { id: '4', name: 'Product D', price: 20, rating: 4, popularity: 1 }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        CommonModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatSnackBarModule,
        HttpClientTestingModule
      ],
      providers: [
        {
          provide: CartService,
          useValue: jasmine.createSpyObj('CartService', ['addToCart'], {
            cart$: of({ name: 'Budweiser', price: 2.99 })
          })
        },
        {
          provide: MatDialog,
          useValue: jasmine.createSpyObj('MatDialog', ['open'])
        },
        {
          provide: MatDialogRef,
          useValue: jasmine.createSpyObj('MatDialogRef', ['close'])
        },
        {
          provide: MatSnackBar,
          useValue: jasmine.createSpyObj('MatSnackBar', ['open'])
        },
        {
          provide: MatSnackBarRef,
          useValue: jasmine.createSpyObj('MatSnackBarRef', ['onAction'])
        },
        {
          provide: ProductService,
          useValue: jasmine.createSpyObj('ProductService', [], {
            products$: of(mockProducts)
          })
        }
      ]
    }).compileComponents();

    cartServiceSpy = TestBed.inject(CartService) as jasmine.SpyObj<CartService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  describe('onDocumentClick', () => {
    it('should set showSearchBar to true if event target is inside searchBarElement', () => {
      // Arrange
      const event: any = new MouseEvent('click');
      const searchBarElement = fixture.debugElement.query(By.css('.nav-header-search__bar'));
      component.searchBarElement = searchBarElement;

      // Simulate event target inside searchBarElement
      spyOn(event, 'target').and.returnValue(searchBarElement);

      // Act
      searchBarElement.nativeElement.click();

      // Assert
      expect(component.showSearchBar).toBe(true);
    });

    it('should set showSearchBar to false if event target is outside searchBarElement', () => {
      // Arrange
      const event: any = new MouseEvent('click');
      const searchBarElement = fixture.debugElement.query(By.css('.nav-header-search__bar'));
      component.searchBarElement = searchBarElement;

      // Simulate event target outside searchBarElement
      const outsideElement = document.createElement('div');
      spyOn(event, 'target').and.returnValue(outsideElement);

      // Act
      component.onDocumentClick(event);

      // Assert
      expect(component.showSearchBar).toBe(false);
    });
  });

  describe('constructor', () => {
    it('should filter products based on search input', fakeAsync(() => {
      // Arrange
      const product = [{ id: '1', name: 'Product A', price: 15, rating: 3, popularity: 2 }];
      spyOn(component.searchBarFormControl.valueChanges, 'subscribe');

      // Act
      component.searchBarFormControl.setValue('Product A');
      tick(300);

      // Assert
      expect(component.filteredItems()).toEqual(product as any);
    }));
  });

  describe('openCart', () => {
    it('should open cart dialog', () => {
      // Arrange
      spyOn(component.dialog, 'open').and.returnValue({
        afterClosed: () => of()
      } as any);

      // Act
      component.openCart();

      // Assert
      expect(component.dialog.open).toHaveBeenCalledWith(CartDialogComponent, {
        width: '480px'
      });
    });
  });

  describe('addToCart', () => {
    it('should add product to cart and show snackbar', () => {
      // Arrange
      spyOn(component.snackBar, 'open').and.returnValue({
        onAction: () => of({})
      } as any);
      spyOn(component, 'openCart');

      // Act
      component.addToCart({ id: '1', name: 'Product 1', price: 10, rating: 4, popularity: 100 } as any);

      // Assert
      expect(cartServiceSpy.addToCart).toHaveBeenCalledWith({
        id: '1',
        name: 'Product 1',
        price: 10,
        rating: 4,
        popularity: 100
      } as any);
      expect(component.snackBar.open).toHaveBeenCalledWith('Product added to the cart.', 'Open Cart', {
        duration: 3000
      });
      expect(component.openCart).toHaveBeenCalled();
    });
  });
});
