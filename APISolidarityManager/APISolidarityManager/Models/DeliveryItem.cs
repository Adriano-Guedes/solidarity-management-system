namespace APISolidarityManager.Models
{
    public class DeliveryItem
    {
        public Guid DeliveryId { get; set; }
        public Guid ItemId { get; set; }
        public int Quantity { get; set; }

        public Delivery Delivery { get; set; } = null!;
        public Item Item { get; set; } = null!;
    }
}
