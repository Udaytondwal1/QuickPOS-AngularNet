using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using POSAPI.Data;
using POSAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace POSAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class POSController : ControllerBase
    {
        private readonly AppDbContext _context;

        public POSController(AppDbContext context)
        {
            _context = context;
        }

        // POST: api/pos/add-category
        [HttpPost("add-category")]
        public IActionResult AddCategory([FromBody] Category category)
        {
            if (string.IsNullOrEmpty(category.Name))
            {
                return BadRequest("Category Name is required.");
            }

            _context.Categories.Add(category);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetCategoryById), new { id = category.Id }, category);
        }

        // GET: api/pos/categories
        [HttpGet("categories")]
        public IActionResult GetAllCategories()
        {
            var categories = _context.Categories.ToList();
            return Ok(categories);
        }

        // GET: api/pos/category/{id}
        [HttpGet("category/{id}")]
        public IActionResult GetCategoryById(int id)
        {
            var category = _context.Categories.FirstOrDefault(c => c.Id == id);
            if (category == null)
            {
                return NotFound();
            }

            return Ok(category);
        }

        // PUT: api/pos/update-category/{id}
        [HttpPut("update-category/{id}")]
        public IActionResult UpdateCategory(int id, [FromBody] Category category)
        {
            var existing = _context.Categories.FirstOrDefault(c => c.Id == id);
            if (existing == null)
            {
                return NotFound();
            }

            existing.Name = category.Name;
            existing.Description = category.Description;

            _context.SaveChanges();
            return NoContent();
        }

        // DELETE: api/pos/delete-category/{id}
        [HttpDelete("delete-category/{id}")]
        public IActionResult DeleteCategory(int id)
        {
            var category = _context.Categories.FirstOrDefault(c => c.Id == id);
            if (category == null)
            {
                return NotFound();
            }

            _context.Categories.Remove(category);
            _context.SaveChanges();
            return NoContent();
        }


        // POST: api/pos/add-product
        [HttpPost("add-product")]
        public IActionResult AddProduct([FromBody] Product product)
        {
            if (string.IsNullOrEmpty(product.Name))
            {
                return BadRequest("Product Name is required.");
            }

            _context.Products.Add(product);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetProductById), new { id = product.Id }, product);
        }

        // GET: api/pos/products
        [HttpGet("products")]
        public IActionResult GetAllProducts()
        {
            var products = _context.Products.ToList();
            return Ok(products);
        }

        // GET: api/pos/product/{id}
        [HttpGet("product/{id}")]
        public IActionResult GetProductById(int id)
        {
            var product = _context.Products.FirstOrDefault(p => p.Id == id);
            if (product == null)
            {
                return NotFound();
            }

            return Ok(product);
        }

        // PUT: api/pos/update-product/{id}
        [HttpPut("update-product/{id}")]
        public IActionResult UpdateProduct(int id, [FromBody] Product product)
        {
            var existing = _context.Products.FirstOrDefault(p => p.Id == id);
            if (existing == null)
            {
                return NotFound();
            }

            existing.Name = product.Name;
            existing.SKU = product.SKU;
            existing.Category = product.Category;
            existing.Price = product.Price;
            existing.Quantity = product.Quantity;
            existing.Tax = product.Tax;
            existing.Description = product.Description;

            _context.SaveChanges();
            return NoContent();
        }

        // DELETE: api/pos/delete-product/{id}
        [HttpDelete("delete-product/{id}")]
        public IActionResult DeleteProduct(int id)
        {
            var product = _context.Products.FirstOrDefault(p => p.Id == id);
            if (product == null)
            {
                return NotFound();
            }

            _context.Products.Remove(product);
            _context.SaveChanges();
            return NoContent();
        }

        // GET: api/orders/get-order/{id}
        [HttpGet("get-order/{id}")]
        public IActionResult GetOrder(int id)
        {
            var order = _context.Orders
                .Include(o => o.Items) // Include related items
                .FirstOrDefault(o => o.OrderId == id);

            if (order == null)
            {
                return NotFound();
            }

            return Ok(order);
        }


        // POST: api/orders/create-order
        [HttpPost("create-order")]
        public IActionResult CreateOrder([FromBody] Order order)
        {
            // Validate the order
            if (order.Items == null || !order.Items.Any())
            {
                return BadRequest("Order must contain at least one item.");
            }

            // Set the order date if not provided
            if (order.OrderDate == default)
            {
                order.OrderDate = DateTime.Now;
            }

            // Deduct product quantities
            foreach (var item in order.Items)
            {
                // Fetch the product from the database
                var product = _context.Products.FirstOrDefault(p => p.Name == item.ProductName);
                if (product == null)
                {
                    return BadRequest($"Product {item.ProductName} not found.");
                }

                // Check if there is sufficient stock
                if (product.Quantity < item.Quantity)
                {
                    return BadRequest($"Insufficient stock for product '{product.Name}'. Available: {product.Quantity}, Requested: {item.Quantity}");
                }

                // Deduct the quantity
                product.Quantity -= item.Quantity;
            }

            // Add the order and related items to the database
            _context.Orders.Add(order);

            // Save changes to the database
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetOrder), new { id = order.OrderId }, order);
        }






        // DELETE: api/orders/delete-order/{id}
        [HttpDelete("delete-order/{id}")]
        public IActionResult DeleteOrder(int id)
        {
            var order = _context.Orders.FirstOrDefault(o => o.OrderId == id);

            if (order == null)
            {
                return NotFound();
            }

            _context.Orders.Remove(order);
            _context.SaveChanges();
            return NoContent();
        }

        // GET: api/orders/get-all-orders
        [HttpGet("get-all-orders")]
        public IActionResult GetAllOrders()
        {
            var orders = _context.Orders
                .Include(o => o.Items) // Include related items
                .OrderByDescending(o => o.OrderDate) // Optional: sort by date
                .ToList();

            return Ok(orders);
        }

        // PUT: api/orders/update-order-quantity/{id}
        [HttpPut("update-order-quantity/{id}")]
        public IActionResult UpdateOrderQuantity(int id, [FromBody] List<OrderItem> updatedItems)
        {
            // Find the order by ID
            var existingOrder = _context.Orders
                .Include(o => o.Items) // Include related items
                .FirstOrDefault(o => o.OrderId == id);

            if (existingOrder == null)
            {
                return NotFound("Order not found.");
            }

            // Adjust quantities and stock for each updated item
            foreach (var updatedItem in updatedItems)
            {
                // Find the existing order item
                var existingItem = existingOrder.Items.FirstOrDefault(i => i.OrderItemId == updatedItem.OrderItemId);
                if (existingItem != null)
                {
                    // Fetch the product for this item
                    var product = _context.Products.FirstOrDefault(p => p.Name == existingItem.ProductName);
                    if (product == null)
                    {
                        return BadRequest($"Product {existingItem.ProductName} not found.");
                    }

                    // Calculate the quantity difference
                    int quantityDifference = updatedItem.Quantity - existingItem.Quantity;

                    // Handle stock based on quantity difference
                    if (quantityDifference > 0) // Quantity increased
                    {
                        // Check if stock is sufficient
                        if (product.Quantity < quantityDifference)
                        {
                            return BadRequest($"Insufficient stock for product '{product.Name}'. Available: {product.Quantity}, Requested increase: {quantityDifference}");
                        }

                        // Deduct from product stock
                        product.Quantity -= quantityDifference;
                    }
                    else if (quantityDifference < 0) // Quantity decreased
                    {
                        // Add back to product stock
                        product.Quantity += Math.Abs(quantityDifference);
                    }

                    // Update the order item quantity
                    existingItem.Quantity = updatedItem.Quantity;

                    // Update subtotal and tax for the updated item
                    decimal TaxRate = existingItem.Total > 0
                        ? Math.Round((existingItem.Tax / existingItem.Total) * 100, 1)
                        : 0;
                    existingItem.Total = existingItem.Price * updatedItem.Quantity;
                    existingItem.Tax = (TaxRate * existingItem.Total) / 100;
                }
            }

            // Recalculate the overall order subtotal, tax, and total amount
            existingOrder.Subtotal = existingOrder.Items.Sum(i => i.Total);
            existingOrder.Tax = existingOrder.Items.Sum(i => i.Tax);
            existingOrder.TotalAmount = existingOrder.Subtotal + existingOrder.Tax;

            // Save changes to both order and product quantities
            _context.SaveChanges();

            return Ok(existingOrder);
        }


        // PUT: api/orders/cancel-order/{id}
        [HttpPut("cancel-order/{id}")]
        public IActionResult CancelOrder(int id)
        {
            // Find the order by ID
            var existingOrder = _context.Orders
                .Include(o => o.Items) // Include related items
                .FirstOrDefault(o => o.OrderId == id);

            if (existingOrder == null)
            {
                return NotFound();
            }

            // Updating Order Status
            existingOrder.PaymentStatus = "Canceled";

            // Save changes
            _context.SaveChanges();
            return NoContent();
        }


    }
}
