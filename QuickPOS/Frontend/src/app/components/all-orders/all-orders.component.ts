import { Component, OnInit, ViewChild } from '@angular/core';
import { PosServiceService } from 'src/app/service/pos-service.service';
import * as XLSX from 'xlsx';  // For Excel export
import { jsPDF } from 'jspdf';  // For PDF export
import { Table } from 'primeng/table';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-all-orders',
  templateUrl: './all-orders.component.html',
  styleUrls: ['./all-orders.component.css']
})
export class AllOrdersComponent implements OnInit {

  orders: any[] = [];
  filteredOrders: any[] = [];
  loading: boolean = true;
  searchQuery: string = '';

  @ViewChild('orderTable') orderTable: any;  // Reference to the table

  constructor(private posService: PosServiceService) {}

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders(): void {
    this.posService.getAllOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.filteredOrders = data; // Initially, display all orders
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching orders:', err);
        this.loading = false;
      },
    });
  }

  filterOrders(): void {
    if (!this.searchQuery.trim()) {
      this.filteredOrders = this.orders; // Show all orders if search is empty
    } else {
      this.filteredOrders = this.orders.filter((order) => {
        const query = this.searchQuery.toLowerCase();
        return (
          order.orderId.toString().toLowerCase().includes(query) ||
          (order.customerName && order.customerName.toLowerCase().includes(query)) ||
          (order.paymentMode && order.paymentMode.toLowerCase().includes(query)) ||
          (order.paymentStatus && order.paymentStatus.toLowerCase().includes(query))
        );
      });
    }
  }

  // Export to Excel
  exportToExcel(): void {
    // Get the table data manually and exclude the "Action" column
    const tableElement: HTMLTableElement = this.orderTable.nativeElement;
    const rows: HTMLCollectionOf<HTMLTableRowElement> = tableElement.rows;

    // Create an array to hold the filtered data
    const filteredData: any[][] = [];

    // Loop through rows and exclude the "Action" column
    for (let i = 0; i < rows.length; i++) {
      const cells = rows[i].cells;
      const rowData: any[] = [];

      // Select the specific columns to keep (index 0 to 4, excluding index 5)
      for (let j = 0; j < cells.length - 1; j++) {
        // Adjusted range to skip the last column
        rowData.push(cells[j].innerText);
      }

      filteredData.push(rowData);
    }

    // Convert the filtered data into a worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(filteredData);

    // Set column widths (optional)
    ws['!cols'] = [
      { wch: 10 }, // Order ID
      { wch: 20 }, // Customer Name
      { wch: 20 }, // Order Date
      { wch: 15 }, // Total Amount
      { wch: 15 }, // Payment Mode
    ];

    // Create a new workbook and append the worksheet
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Order List');

    // Write the Excel file
    XLSX.writeFile(wb, 'order-list.xlsx');
  }

  // Export to PDF
  exportToPDF(): void {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text('Order List', 14, 22);

    // Add table headers
    doc.setFontSize(12);
    doc.text('Order ID', 14, 30);
    doc.text('Customer Name', 50, 30);
    doc.text('Order Date', 100, 30);
    doc.text('Total Amount', 140, 30);
    doc.text('Payment Mode', 180, 30);
    doc.text('Order Status', 220, 30);

    // Function to format date as dd-mm-yyyy
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

    // Add table rows
    this.filteredOrders.forEach((order, index) => {
      const y = 40 + (index * 10); // Set row height based on index

       // Format the date before adding it to the PDF
    const formattedDate = formatDate(order.orderDate);

      doc.text(`#${order.orderId}`, 14, y);
      doc.text(order.customerName || 'N/A', 50, y);
      // doc.text(order.orderDate, 100, y);
      doc.text(formattedDate,  100, y); // Order Date in dd-mm-yyyy
      doc.text(`${order.totalAmount}`, 140, y);
      doc.text(order.paymentMode || 'Cash', 180, y);
      doc.text(order.paymentStatus || 'Pending', 220, y);
    });

    // Save the PDF
    doc.save('order-list.pdf');
  }
}
