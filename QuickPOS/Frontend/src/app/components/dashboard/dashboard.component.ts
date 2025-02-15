import { Component, OnInit } from '@angular/core';
import { PosServiceService } from 'src/app/service/pos-service.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  totalProducts: number = 0;
  totalCategories: number = 0;
  paidOrders: number = 0;
  pendingOrders: number = 0;

  constructor(private posService: PosServiceService) {}

  ngOnInit(): void {
    this.getTotalProducts();
    this.getTotalCategories();
    this.getOrders();
  }

  getTotalProducts(): void {
    this.posService.getProducts().subscribe((products) => {
      this.totalProducts = products.length;
    });
  }

  getTotalCategories(): void {
    this.posService.getCategories().subscribe((categories) => {
      this.totalCategories = categories.length;
    });
  }

  getOrders(): void {
    this.posService.getAllOrders().subscribe((orders) => {
      this.paidOrders = orders.filter((order) => order.paymentStatus === 'Paid').length;
      this.pendingOrders = orders.filter((order) => order.paymentStatus === 'Pending').length;
      console.log(this.paidOrders)
    });
  }
}
