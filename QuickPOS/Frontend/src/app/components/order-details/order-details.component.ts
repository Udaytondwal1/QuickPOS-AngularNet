import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PosServiceService } from 'src/app/service/pos-service.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css'],
})
export class OrderDetailsComponent implements OnInit {
  orderId: string | null = null;
  orderDetails: any = null; // Holds the fetched order details
  alertMessage: string | null = null; // Holds the alert message
  alertType: string | null = null; // Holds the alert type (success, error)

  constructor(private posService: PosServiceService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Get the order ID from the route parameters
    this.orderId = this.route.snapshot.paramMap.get('id');
    if (this.orderId) {
      this.fetchOrderDetails(this.orderId);
    }
  }

  // Fetch order details using the PosService
  fetchOrderDetails(orderId: any): void {
    this.posService.getOrder(orderId).subscribe({
      next: (data) => {
        this.orderDetails = data;
        console.log(this.orderDetails);
      },
      error: (err) => {
        console.error('Error fetching order details:', err);
        this.showAlert('Error fetching order details. Please try again.', 'error');
      },
    });
  }

  // Triggered when the "Print Invoice" button is clicked
  printInvoice(): void {
    window.print(); // Opens the browser's print dialog
  }

  // Opens the modify order modal
  openModifyOrderModal(): void {
    const modifyOrderModal = document.getElementById(
      'modify-order-modal'
    ) as HTMLInputElement;
    modifyOrderModal.checked = true; // Open the modal
  }

  // Saves the modified order quantities
  saveModifiedOrder(): void {
    let isQuantityUpdated = false;
  
    // Loop through products to update quantities
    this.orderDetails.items.forEach((product: any) => {
      if (product.newQuantity && product.newQuantity !== product.quantity) {
        product.quantity = product.newQuantity; // Update quantity
        isQuantityUpdated = true;
      }
    });
  
    if (isQuantityUpdated) {
      // Call your API to save changes if needed
      this.posService.updateOrderQuantity(this.orderDetails.orderId, this.orderDetails.items).subscribe({
        next: () => {
          this.showAlert('Order quantities have been updated successfully!', 'success');
          this.fetchOrderDetails(this.orderId);
        },
        error: (err) => {
          console.error('Error updating order:', err);
          this.showAlert('Failed to update order. Please try again.', 'error');
        },
      });
    } else {
      this.showAlert('No changes were made to the order quantities.', 'info');
    }
  
    // Close the modal
    const modifyOrderModal = document.getElementById('modify-order-modal') as HTMLInputElement;
    modifyOrderModal.checked = false;
  }

  // Cancel the order
  CancelOrder(id: number) {
    this.posService.CancelOrder(id).subscribe({
      next: () => {
        this.showAlert('Order is Canceled.', 'success');
        this.fetchOrderDetails(this.orderId);
      },
      error: (err) => {
        console.error('Error fetching order details:', err);
        this.showAlert('Something went wrong, please try again!', 'error');
      },
    });
  }

  // Method to show an alert
  showAlert(message: string, type: string) {
    this.alertMessage = message;
    this.alertType = type;

    // Close the alert after 3 seconds
  setTimeout(() => {
    this.alertMessage = null;
    this.alertType = null; // Reset alertType too to avoid lingering styles
  }, 3000);
  }

}
