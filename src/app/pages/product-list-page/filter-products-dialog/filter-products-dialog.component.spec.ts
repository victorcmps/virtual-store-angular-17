import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterProductsDialogComponent } from './filter-products-dialog.component';

describe('FilterProductsDialogComponent', () => {
  let component: FilterProductsDialogComponent;
  let fixture: ComponentFixture<FilterProductsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterProductsDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FilterProductsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
