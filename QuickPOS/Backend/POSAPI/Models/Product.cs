using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace POSAPI.Models
{
    public class Product
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; }

        [MaxLength(255)]
        public string SKU { get; set; }

        public string Category { get; set; }

        public int Price { get; set; }

        public int Quantity { get; set; }

        public int Tax { get; set; }

        public string Description { get; set; }
    }
}