import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FilterFormModel } from '../../../models/filter-form.model';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-filter-products-dialog',
  templateUrl: './filter-products-dialog.component.html',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSliderModule,
    NgxMaskDirective
  ],
  providers: [provideNgxMask()],
  styleUrls: ['./filter-products-dialog.component.scss']
})
export class FilterProductsDialogComponent {
  public readonly formGroup: FormGroup;

  public constructor(
    @Inject(MAT_DIALOG_DATA) public readonly data: { formGroup: FilterFormModel },
    private readonly dialogRef: MatDialogRef<FilterProductsDialogComponent>,
    private readonly formBuilder: FormBuilder
  ) {
    this.formGroup = this.formBuilder.group({
      minPrice: [data?.formGroup?.minPrice ?? null, [Validators.min(0), Validators.max(100)]],
      maxPrice: [data?.formGroup?.maxPrice ?? null, [Validators.min(0), Validators.max(100)]],
      minRating: [data?.formGroup?.minRating ?? null, [Validators.min(0), Validators.max(5)]],
      maxRating: [data?.formGroup?.maxRating ?? null, [Validators.min(0), Validators.max(5)]],
      minPopularity: [data?.formGroup?.minPopularity ?? null, [Validators.min(0), Validators.max(5)]],
      maxPopularity: [data?.formGroup?.maxPopularity ?? null, [Validators.min(0), Validators.max(5)]]
    });
  }

  public readonly saveFilter = (): void => {
    if (!this.formGroup.valid) {
      return;
    }

    this.dialogRef.close(this.formGroup.value);
  };
}
