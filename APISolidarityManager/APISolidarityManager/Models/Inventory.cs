namespace APISolidarityManager.Models
{
    public class Inventory
    {
        public Guid ItemId { get; set; }
        public int QuantityAvailable { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public Item Item { get; set; } = null!;
    }
}
