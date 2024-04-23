/* eslint-disable @typescript-eslint/no-explicit-any */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CartDialogComponent } from '../cart-dialog/cart-dialog.component';
import { CartService } from '../../services/cart/cart.service';
import { FilterProductsDialogComponent } from './filter-products-dialog/filter-products-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { OrderByTypesEnum } from '../../enums/order-by-types.enum';
import { ProductListPageComponent } from './product-list-page.component';
import { ProductService } from '../../services/product/product.service';
import { ReactiveFormsModule } from '@angular/forms';
import { SortTypesEnum } from '../../enums/sort-by-types.enum';
import { of } from 'rxjs';

describe('ProductListPageComponent', () => {
  let component: ProductListPageComponent;
  let fixture: ComponentFixture<ProductListPageComponent>;
  let cartServiceSpy: jasmine.SpyObj<CartService>;

  const mockProducts = [
    { id: '2', name: 'Product B', price: 5, rating: 1, popularity: 4 },
    { id: '3', name: 'Product C', price: 10, rating: 2, popularity: 3 },
    { id: '1', name: 'Product A', price: 15, rating: 3, popularity: 2 },
    { id: '4', name: 'Product D', price: 20, rating: 4, popularity: 1 }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, MatDialogModule, MatSnackBarModule, ReactiveFormsModule],
      providers: [
        {
          provide: CartService,
          useValue: jasmine.createSpyObj('CartService', ['addToCart'], {
            cart$: of([{ name: 'Budweiser', price: 2.99 }])
          })
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
    fixture = TestBed.createComponent(ProductListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  describe('constructor', () => {
    it('should sort products by name ascending', () => {
      // Act
      component.sortByFormControl.setValue(SortTypesEnum.Name);
      component.orderByFormControl.setValue(OrderByTypesEnum.Ascending);

      expect(component.products()).toEqual([
        { id: '1', name: 'Product A', price: 15, rating: 3, popularity: 2 },
        { id: '2', name: 'Product B', price: 5, rating: 1, popularity: 4 },
        { id: '3', name: 'Product C', price: 10, rating: 2, popularity: 3 },
        { id: '4', name: 'Product D', price: 20, rating: 4, popularity: 1 }
      ] as any);
    });

    it('should sort products by name descending', () => {
      // Act
      component.sortByFormControl.setValue(SortTypesEnum.Name);
      component.orderByFormControl.setValue(OrderByTypesEnum.Descending);

      expect(component.products()).toEqual([
        { id: '4', name: 'Product D', price: 20, rating: 4, popularity: 1 },
        { id: '3', name: 'Product C', price: 10, rating: 2, popularity: 3 },
        { id: '2', name: 'Product B', price: 5, rating: 1, popularity: 4 },
        { id: '1', name: 'Product A', price: 15, rating: 3, popularity: 2 }
      ] as any);
    });

    it('should sort products by popularity ascending', () => {
      // Act
      component.sortByFormControl.setValue(SortTypesEnum.Popularity);
      component.orderByFormControl.setValue(OrderByTypesEnum.Ascending);

      expect(component.products()).toEqual([
        { id: '4', name: 'Product D', price: 20, rating: 4, popularity: 1 },
        { id: '1', name: 'Product A', price: 15, rating: 3, popularity: 2 },
        { id: '3', name: 'Product C', price: 10, rating: 2, popularity: 3 },
        { id: '2', name: 'Product B', price: 5, rating: 1, popularity: 4 }
      ] as any);
    });

    it('should sort products by popularity descending', () => {
      // Act
      component.sortByFormControl.setValue(SortTypesEnum.Popularity);
      component.orderByFormControl.setValue(OrderByTypesEnum.Descending);

      expect(component.products()).toEqual([
        { id: '2', name: 'Product B', price: 5, rating: 1, popularity: 4 },
        { id: '3', name: 'Product C', price: 10, rating: 2, popularity: 3 },
        { id: '1', name: 'Product A', price: 15, rating: 3, popularity: 2 },
        { id: '4', name: 'Product D', price: 20, rating: 4, popularity: 1 }
      ] as any);
    });

    it('should sort products by price ascending', () => {
      // Act
      component.sortByFormControl.setValue(SortTypesEnum.Price);
      component.orderByFormControl.setValue(OrderByTypesEnum.Ascending);

      expect(component.products()).toEqual([
        { id: '2', name: 'Product B', price: 5, rating: 1, popularity: 4 },
        { id: '3', name: 'Product C', price: 10, rating: 2, popularity: 3 },
        { id: '1', name: 'Product A', price: 15, rating: 3, popularity: 2 },
        { id: '4', name: 'Product D', price: 20, rating: 4, popularity: 1 }
      ] as any);
    });

    it('should sort products by price descending', () => {
      // Act
      component.sortByFormControl.setValue(SortTypesEnum.Price);
      component.orderByFormControl.setValue(OrderByTypesEnum.Descending);

      expect(component.products()).toEqual([
        { id: '4', name: 'Product D', price: 20, rating: 4, popularity: 1 },
        { id: '1', name: 'Product A', price: 15, rating: 3, popularity: 2 },
        { id: '3', name: 'Product C', price: 10, rating: 2, popularity: 3 },
        { id: '2', name: 'Product B', price: 5, rating: 1, popularity: 4 }
      ] as any);
    });

    it('should sort products by rating ascending', () => {
      // Act
      component.sortByFormControl.setValue(SortTypesEnum.Price);
      component.orderByFormControl.setValue(OrderByTypesEnum.Ascending);

      expect(component.products()).toEqual([
        { id: '2', name: 'Product B', price: 5, rating: 1, popularity: 4 },
        { id: '3', name: 'Product C', price: 10, rating: 2, popularity: 3 },
        { id: '1', name: 'Product A', price: 15, rating: 3, popularity: 2 },
        { id: '4', name: 'Product D', price: 20, rating: 4, popularity: 1 }
      ] as any);
    });

    it('should sort products by rating descending', () => {
      // Act
      component.sortByFormControl.setValue(SortTypesEnum.Price);
      component.orderByFormControl.setValue(OrderByTypesEnum.Descending);

      expect(component.products()).toEqual([
        { id: '4', name: 'Product D', price: 20, rating: 4, popularity: 1 },
        { id: '1', name: 'Product A', price: 15, rating: 3, popularity: 2 },
        { id: '3', name: 'Product C', price: 10, rating: 2, popularity: 3 },
        { id: '2', name: 'Product B', price: 5, rating: 1, popularity: 4 }
      ] as any);
    });

    it('should filter products', () => {
      component.filterFormControl.setValue({
        minPrice: 1,
        maxPrice: 10,
        minRating: 1,
        maxRating: 5,
        minPopularity: 1,
        maxPopularity: 5
      });

      expect(component.products()).toEqual([
        { id: '2', name: 'Product B', price: 5, rating: 1, popularity: 4 },
        { id: '3', name: 'Product C', price: 10, rating: 2, popularity: 3 }
      ] as any);
    });
  });

  describe('openCart', () => {
    it('should open cart dialog', () => {
      // Arrange
      spyOn(component.dialog, 'open');

      // Act
      component.openCart();

      // Assert
      expect(component.dialog.open).toHaveBeenCalledWith(CartDialogComponent, {
        width: '480px'
      });
    });
  });

  describe('openFilterConfiguratorDialog', () => {
    it('should open filter configurator dialog', () => {
      // Arrange
      spyOn(component.dialog, 'open').and.returnValue({
        afterClosed: () => of({ minPrice: 10, maxPrice: 100 })
      } as any);

      spyOn(component.snackBar, 'open').and.returnValue({
        onAction: () => of({})
      } as any);

      // Act
      component.openFilterConfiguratorDialog();

      // Assert
      expect(component.dialog.open).toHaveBeenCalledWith(FilterProductsDialogComponent, {
        width: '600px',
        data: {
          formGroup: {
            minPrice: null,
            maxPrice: null,
            minRating: null,
            maxRating: null,
            minPopularity: null,
            maxPopularity: null
          }
        }
      });
      expect(component.filterFormControl.value).toEqual({ minPrice: 10, maxPrice: 100 } as any);
      expect(component.snackBar.open).toHaveBeenCalledWith('Products filtered.', 'Close', { duration: 3000 });
    });

    it('should open filter configurator dialog and clean all filters when all filterFormControl values are empty or null', () => {
      // Arrange
      spyOn(component.dialog, 'open').and.returnValue({
        afterClosed: () => of({ minPrice: null, maxPrice: null })
      } as any);

      spyOn(component.snackBar, 'open').and.returnValue({
        onAction: () => of({})
      } as any);

      // Act
      component.openFilterConfiguratorDialog();

      // Assert
      expect(component.dialog.open).toHaveBeenCalledWith(FilterProductsDialogComponent, {
        width: '600px',
        data: {
          formGroup: {
            minPrice: null,
            maxPrice: null,
            minRating: null,
            maxRating: null,
            minPopularity: null,
            maxPopularity: null
          }
        }
      });
      expect(component.filterFormControl.value).toEqual({
        minPrice: null,
        maxPrice: null,
        minRating: null,
        maxRating: null,
        minPopularity: null,
        maxPopularity: null
      } as any);
      expect(component.snackBar.open).toHaveBeenCalledWith('Product filters have been reset to default.', 'Close', {
        duration: 3000
      });
    });
  });

  describe('cleanAllFilters', () => {
    it('should reset form group and save filter', () => {
      // Arrange
      component.filterFormControl.setValue({
        minPrice: 10,
        maxPrice: 50,
        minRating: 2,
        maxRating: 4,
        minPopularity: 1,
        maxPopularity: 3
      });

      // Act
      component.cleanAllFilters();

      // Assert
      expect(component.filterFormControl.disabled).toBeTruthy();
    });
  });

  describe('addToCart', () => {
    it('should add product to cart', () => {
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
