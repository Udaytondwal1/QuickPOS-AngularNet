using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace POSAPI.Models
{
    public class OrderItem
    {
         public int OrderItemId { get; set; }
        public string ProductName { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public decimal Tax { get; set; }
        public decimal Total { get; set; }
        public int OrderId { get; set; }
    }
}
