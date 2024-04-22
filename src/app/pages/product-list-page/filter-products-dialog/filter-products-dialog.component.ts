import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-filter-products-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSliderModule
  ],
  templateUrl: './filter-products-dialog.component.html',
  styleUrl: './filter-products-dialog.component.scss'
})
export class FilterProductsDialogComponent {
  public readonly formGroup: FormGroup;

  public constructor(private formBuilder: FormBuilder) {
    this.formGroup = this.formBuilder.group({
      minPrice: [0],
      maxPrice: [100],
      minRating: [''],
      maxRating: [''],
      minPopularity: [''],
      maxPopularity: ['']
    });
  }
}
