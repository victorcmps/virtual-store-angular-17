import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FilterProductsDialogComponent } from './filter-products-dialog.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('FilterProductsDialogComponent', () => {
  let component: FilterProductsDialogComponent;
  let fixture: ComponentFixture<FilterProductsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, HttpClientTestingModule, ReactiveFormsModule],
      providers: [
        FormBuilder,
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            formGroup: {
              minPrice: null,
              maxPrice: null,
              minRating: null,
              maxRating: null,
              minPopularity: null,
              maxPopularity: null
            }
          }
        },
        { provide: MatDialogRef, useValue: jasmine.createSpyObj('MatDialogRef', ['close']) }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterProductsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('constructor', () => {
    it('should initialize form group with default values', () => {
      expect(component.formGroup).toBeInstanceOf(FormGroup);
      expect(component.formGroup.get('minPrice')?.value).toBeNull();
      expect(component.formGroup.get('maxPrice')?.value).toBeNull();
      expect(component.formGroup.get('minRating')?.value).toBeNull();
      expect(component.formGroup.get('maxRating')?.value).toBeNull();
      expect(component.formGroup.get('minPopularity')?.value).toBeNull();
      expect(component.formGroup.get('maxPopularity')?.value).toBeNull();
    });
  });

  describe('saveFilter', () => {
    it('should save filter when form is valid', () => {
      // Arrange
      const dialogRef = TestBed.inject(MatDialogRef);
      component.formGroup.setValue({
        minPrice: 0,
        maxPrice: 100,
        minRating: 0,
        maxRating: 5,
        minPopularity: 0,
        maxPopularity: 5
      });

      // Act
      component.saveFilter();

      // Assert
      expect(dialogRef.close).toHaveBeenCalledWith(component.formGroup.value);
    });

    it('should not save filter when form is invalid', () => {
      // Arrange
      const dialogRef = TestBed.inject(MatDialogRef);

      component.formGroup.setValue({
        minPrice: 0,
        maxPrice: 100,
        minRating: 0,
        maxRating: 10, // Invalid value
        minPopularity: 0,
        maxPopularity: 5
      });

      // Act
      component.saveFilter();

      // Assert
      expect(dialogRef.close).not.toHaveBeenCalled();
    });
  });
});
