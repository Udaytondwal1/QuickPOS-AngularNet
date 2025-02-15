import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { PosServiceService } from 'src/app/service/pos-service.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  products: any[] = [];
  selectedProduct: any = null;
  isEditMode = false;

  // Flag for showing/hiding the alert
  showGeneralAlert: boolean = false;
  showDeletionAlert: boolean = false;
  alertType: string = '';
  alertMessage: string = '';

  // Store the product ID to be deleted
  productIdToDelete: number | null = null;

  constructor(
    private productService: PosServiceService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  categories: any[] = [];

  loadCategories() {
    this.productService.getCategories().subscribe(
      (data: string[]) => {
        this.categories = data;
        console.log(data);
      },
      (error) => {
        console.error('Error fetching categories:', error);
        this.showAlertMessage('Failed to load categories!', 'error');
      }
    );
  }

  loadProducts() {
    this.productService.getProducts().subscribe(
      (data) => {
        this.products = data;
      },
      (error) => {
        console.error('Error fetching products:', error);
        this.showAlertMessage('Failed to load products!', 'error');
      }
    );
  }

  addProduct() {
    this.selectedProduct = {
      id: null,
      name: '',
      sku: '',
      category: '',
      price: null,
      quantity: null,
      tax: null,
      description: '',
    };
    this.isEditMode = true;
    this.openModal();
  }

  viewProduct(product: any) {
    this.selectedProduct = { ...product };
    this.isEditMode = false;
    this.openModal();
  }

  editProduct(product: any) {
    this.selectedProduct = { ...product };
    this.isEditMode = true;
    this.openModal();
  }

  deleteProduct(productId: number) {
    // Set the product ID for deletion and show the alert
    this.productIdToDelete = productId;
    this.alertMessage = 'Are you sure you want to delete this product?';
    this.alertType = 'info';
    this.showDeletionAlert = true;
  }

  confirmDeletion() {
    if (this.productIdToDelete !== null) {
      this.productService.deleteProduct(this.productIdToDelete).subscribe(
        () => {
          this.products = this.products.filter((product) => product.id !== this.productIdToDelete);
          this.showAlertMessage('Product deleted successfully!', 'success');
          this.productIdToDelete = null;
          this.cdr.detectChanges();
        },
        (error) => {
          console.error('Error deleting product:', error);
          this.showAlertMessage('Failed to delete product!', 'error');
          this.productIdToDelete = null;
        }
      );
    }
    this.closeAlert();
  }

  cancelDeletion() {
    this.productIdToDelete = null;
    this.closeAlert();
  }

  closeAlert() {
    this.showDeletionAlert = false;
    this.showGeneralAlert = false;
  }

  saveProduct() {
    if (this.selectedProduct.id) {
      this.productService.updateProduct(this.selectedProduct.id, this.selectedProduct).subscribe(
        () => {
          this.showAlertMessage('Product updated successfully!', 'success');
          this.loadProducts();
          this.closeModal();
        },
        (error) => {
          console.error('Error updating product:', error);
          this.showAlertMessage('Failed to update product!', 'error');
        }
      );
    } else {
      const { id, ...productWithoutId } = this.selectedProduct;
  
      this.productService.addProduct(productWithoutId).subscribe(
        (data) => {
          this.showAlertMessage('Product added successfully!', 'success');
          this.loadProducts();
          this.closeModal();
        },
        (error) => {
          console.error('Error adding product:', error);
          this.showAlertMessage('Failed to add product!', 'error');
        }
      );
    }
  }

  closeModal() {
    (document.getElementById('product-modal') as HTMLInputElement).checked = false;
  }

  openModal() {
    (document.getElementById('product-modal') as HTMLInputElement).checked = true;
  }

  // Methods to trigger the alerts
  showAlertMessage(message: string, type: string) {
    this.alertMessage = message;
    this.alertType = type;
    this.showGeneralAlert = true;
    setTimeout(() => this.showGeneralAlert = false, 3000);
  }

  // Methods for managing the deletion confirmation alert
  triggerDeletionAlert(message: string, type: string) {
    this.alertMessage = message;
    this.alertType = type;
    this.showDeletionAlert = true;
  }
}
