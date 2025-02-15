import { Component, OnInit } from '@angular/core';
import { PosServiceService } from 'src/app/service/pos-service.service';

@Component({
  selector: 'app-pos-billing',
  templateUrl: './pos-billing.component.html',
  styleUrls: ['./pos-billing.component.css']
})
export class PosBillingComponent implements OnInit {
  currentDate: Date = new Date();
  searchTerm = '';
  selectedCategory = '';
  categories: any[] = [];
  products: any[] = [];
  filteredProducts: any[] = [];
  orderList: any[] = [];
  subtotal = 0;
  totalTax = 0;
  discount = 0;
  isInvoiceModalOpen = false;
  selectedPaymentMode = 'cash';
  taxAmount: any;
  tax: number | undefined;
  totalTaxPercent: number | undefined;
  customerName: any;
  paymentstatus: any;

  // Flag for showing/hiding the alert
  showAlert = false;
  alertMessage = '';
  alertType = '';  // 'success' or 'error'
  availableQuantity!: number;

  constructor(private posBillingService: PosServiceService) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  get discountAmount() {
    return this.discount > 0
      ? (this.discount.toString().includes('%')
        ? (this.subtotal * parseFloat(this.discount.toString().replace('%', ''))) / 100
        : parseFloat(this.discount.toString()))
      : 0;
  }

  get totalAmount() {
    return this.subtotal + this.totalTax - this.discountAmount;
  }

  loadCategories(): void {
    this.posBillingService.getCategories().subscribe(
      (data) => {
        this.categories = data;
      },
      (error) => {
        console.error('Error fetching categories:', error);
      }
    );
  }

  loadProducts(): void {
    this.posBillingService.getProducts().subscribe(
      (data) => {
        this.products = data;
        this.filteredProducts = [...this.products];
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }

  filterProducts() {
    this.filteredProducts = this.products.filter((product) => {
      const isCategoryMatch = this.selectedCategory ? product.category === this.selectedCategory : true;
      const isSearchMatch = this.searchTerm ? product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) : true;
      const isSKUMatch = this.searchTerm ? product.sku.includes(this.searchTerm) : true;
      return isCategoryMatch && isSearchMatch && isSKUMatch;
    });
  }

  onCategoryChange() {
    this.filterProducts();
  }

  onSearchTermChange() {
    this.filterProducts();
  }

  addProductToOrder(product: any) {
    if(product.quantity > 0) {
    const existing = this.orderList.find((item) => item.id === product.id);
    this.availableQuantity = product.quantity;
      if (existing) {
        existing.quantity++;
        existing.subtotal = existing.quantity * existing.price;
        existing.tax = (existing.subtotal * product.tax) / 100;
      } else {
        this.orderList.push({
          ...product,
          quantity: 1,
          subtotal: product.price,
          tax: (product.price * product.tax) / 100,
          taxRate: product.tax
        });
      }
    } else {
      this.showAlertMessage('Product is out of stock.', 'error');
    }
    this.updateSubtotal();
  }

  // increaseQuantity(item: any) {
  //   item.quantity++;
  //   item.subtotal = item.quantity * item.price;
  //   item.tax = (item.subtotal * item.taxRate) / 100;
  //   this.updateSubtotal();
  // }

  increaseQuantity(item: any) {
    if (item.quantity < this.availableQuantity) {
      item.quantity++;
      item.subtotal = item.quantity * item.price;
      item.tax = (item.subtotal * item.taxRate) / 100;
      this.updateSubtotal();
    } else {
      this.showAlertMessage('No more quantity available.', 'error');
    }
  }

  decreaseQuantity(item: any) {
    if (item.quantity > 1) {
      item.quantity--;
      item.subtotal = item.quantity * item.price;
      item.tax = (item.subtotal * item.taxRate) / 100;
      this.updateSubtotal();
    }
  }

  updateSubtotal() {
    this.subtotal = this.orderList.reduce((sum, item) => sum + (item.subtotal || 0), 0);
    this.totalTax = this.orderList.reduce((sum, item) => sum + (item.tax || 0), 0);
    this.totalTaxPercent = this.subtotal > 0 ? (this.totalTax / this.subtotal) * 100 : 0;

  }

  removeProductFromOrder(item: any) {
    this.orderList = this.orderList.filter((order) => order.id !== item.id);
    this.updateSubtotal();
  }

  clearOrder() {
    this.orderList = [];
    this.subtotal = 0;
    this.totalTax = 0;
    this.discount = 0;
  }

  submitOrder() {
    if (this.orderList.length === 0) {
      this.showAlertMessage('Order list is empty!', 'error');
      return;
    }

    const orderData = {
      customerName: this.customerName,
      paymentStatus: this.paymentstatus,
      orderDate: new Date(),
      paymentMode: this.selectedPaymentMode,
      subtotal: this.subtotal,
      Tax: this.totalTax,
      discount: this.discountAmount,
      totalAmount: this.totalAmount,
      Items: this.orderList.map(item => ({
        ProductName: item.name,
        Quantity: item.quantity,
        Price: item.price,
        Tax: item.tax,
        Total: (item.price * item.quantity) + item.tax
      }))
    };

    this.posBillingService.createOrder(orderData).subscribe(
      (response) => {
        this.showAlertMessage(`Order submitted successfully! Total amount: ₹${this.totalAmount.toFixed(2)}`, 'success');
        this.clearOrder();
        console.log(orderData);
      },
      (error) => {
        console.error('Error submitting order:', error);
        this.showAlertMessage('Error submitting order. Please try again.', 'error');
      }
    );
    this.CloseOrderModel();
  }

  showAlertMessage(message: string, type: string) {
    this.alertMessage = message;
    this.alertType = type;
    this.showAlert = true;

    // Automatically hide the alert after 3 seconds
    setTimeout(() => {
      this.showAlert = false;
    }, 5000);
  }

  openInvoiceModal() {
    this.isInvoiceModalOpen = true;
  }

  closeInvoiceModal() {
    this.isInvoiceModalOpen = false;
  }

  printInvoice() {
    const printContent = document.getElementById('invoice-modal-content');
    if (printContent) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head><title>Invoice</title></head>
            <body>${printContent.innerHTML}</body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  }

  openOrderModal(): void {
    const OrderModal = document.getElementById('order-modal') as HTMLInputElement;
    OrderModal.checked = true;
  }

  CloseOrderModel(): void {
    const OrderModal = document.getElementById('order-modal') as HTMLInputElement;
    OrderModal.checked = false;
  }
}
