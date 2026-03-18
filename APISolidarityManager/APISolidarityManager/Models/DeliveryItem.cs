namespace APISolidarityManager.Models
{
    public class DeliveryItem
    {
        public Guid DeliveryId { get; set; }
        public Guid ItemId { get; set; }
        public int Quantity { get; set; }
    }
}
