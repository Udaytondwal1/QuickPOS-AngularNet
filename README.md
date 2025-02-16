# POS Billing APP

## Overview

The **POS Billing APP** is a modern, feature-rich application designed to streamline point-of-sale processes for businesses. Built with a robust tech stack of **.NET**, **Angular**, and **Daisy UI**, the app provides an intuitive and visually appealing interface with over 30+ colorful themes. It enables efficient management of orders, products, and categories while offering powerful search and export functionalities.

---

## Features

### 1. **Point of Sale (POS)**
   - A seamless, easy-to-use interface for processing sales transactions.
   - Supports adding, modifying, and removing items during the sale process.
   
### 2. **Order Management**
   - **Order List**: View and manage a list of all customer orders.
   - **Order Details**: Detailed view of individual orders, including product quantities, prices, and taxes.

### 3. **Product Management**
   - **Product List**: Add, update, or delete products with pricing and tax details.
   - Categorize products for better organization.

### 4. **Category Management**
   - Manage product categories for easy navigation and filtering.
   - Prevent duplicate sort numbers and ensure proper category hierarchy.

### 5. **Dashboard**
   - Overview of key metrics and analytics to monitor business performance.

### 6. **Search & Filters**
   - Advanced search and filtering capabilities to quickly find products, orders, or categories.

### 7. **Export to Excel & PDF**
   - Export order and product details to Excel or PDF formats for reporting and record-keeping.

### 8. **Themes**
   - Support for over **30+ colorful themes**, powered by Daisy UI.
   - Customize the look and feel of the app to suit your preferences or brand identity.

---

## Tech Stack

### **Frontend**
- **Angular**: A powerful framework for building dynamic and responsive user interfaces.
- **Daisy UI**: A highly customizable and themeable CSS library built on Tailwind CSS.

### **Backend**
- **.NET**: A secure, scalable backend to handle business logic and database operations.

### **Database**
- SQL Server (or your choice of relational database).

---

## Installation

### Prerequisites
- **Node.js** (for Angular development)
- **.NET Core SDK** (for backend development)
- **SQL Server** (or other supported database)
- **Angular CLI**

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/POS-Billing-APP.git
   ```
2. Navigate to the project folder:
   ```bash
   cd POS-Billing-APP
   ```
3. Install Angular dependencies:
   ```bash
   cd frontend
   npm install
   ```
4. Restore .NET dependencies:
   ```bash
   cd backend
   dotnet restore
   ```
5. Configure the database connection in the backend's `appsettings.json`.

6. Build and run the backend:
   ```bash
   dotnet run
   ```
7. Build and run the Angular app:
   ```bash
   cd ../frontend
   ng serve
   ```

---

## Usage

1. Open your browser and navigate to `http://localhost:4200` for the frontend.
2. Use the app to:
   - Process sales in the POS interface.
   - Manage orders, products, and categories.
   - View analytics on the dashboard.
   - Search and filter items with ease.
   - Export data to Excel or PDF.

---

## Screenshots

Add screenshots of key features such as:
- Dashboard View 
![Dashboard View](/QuickPOS/Frontend/screenshots/Screenshot%202025-01-06%20235826.png)

- POS interface
![POS View - Theme 1](/QuickPOS/Frontend/screenshots/1.png)

![POS View - Theme 2](/QuickPOS/Frontend/screenshots/2.png)

- Orders page
![Orders Page](/QuickPOS/Frontend/screenshots/3.png)

- Order Details Page
![Order Details Page](/QuickPOS/Frontend/screenshots/4.png)

---

## Contributing

Contributions are welcome! Follow these steps:
1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Added feature-name"
   ```
4. Push to the branch:  q
   ```bash
   git push origin feature-name
   ```
5. Open a Pull Request.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Acknowledgments

- **Angular** for its robust framework.
- **Daisy UI** for theme support and beautiful UI components.
- **.NET** for a reliable backend.

---

