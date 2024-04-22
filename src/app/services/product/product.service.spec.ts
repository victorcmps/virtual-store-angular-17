/* eslint-disable @typescript-eslint/no-explicit-any */

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProductService } from './product.service';
import { TestBed } from '@angular/core/testing';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, HttpClientTestingModule],
      providers: [ProductService]
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('products$', () => {
    it('should fetch products successfully', () => {
      // Arrange
      const mockProducts = [{ id: 1, name: 'Beer 1' }, { id: 2, name: 'Beer 2' }] as any;
  
      // Act
      service.products$.subscribe((products) => {
        expect(products).toEqual(mockProducts);
      });
  
      // Assert
      const req = httpMock.expectOne('beers');
      expect(req.request.method).toBe('GET');
      req.flush(mockProducts);
    });
  
    it('should handle error when fetching products', () => {
      // Act
      service.products$.subscribe((products) => {
        expect(products).toBeNull();
      });
  
      // Assert
      const req = httpMock.expectOne('beers');
      expect(req.request.method).toBe('GET');
      req.error(new ErrorEvent('Network error'));
    });
  });

});