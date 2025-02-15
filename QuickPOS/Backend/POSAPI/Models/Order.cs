using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace POSAPI.Models
{
    public class Order
    {
        public int OrderId { get; set; }
        public string CustomerName { get; set; }
        public DateTime OrderDate { get; set; }
        public string PaymentMode { get; set; }
        public string PaymentStatus { get; set; }
        public decimal Subtotal { get; set; }
        public decimal Tax { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal Discount { get; set; }
        public List<OrderItem> Items { get; set; } = new List<OrderItem>();
    }
}
