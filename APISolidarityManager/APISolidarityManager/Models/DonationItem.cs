using System.Security.Principal;

namespace APISolidarityManager.Models
{
    public class DonationItem
    {
        public Guid DonationId { get; set; }
        public Guid ItemId { get; set; }
        public int Quantity { get; set; }

        public Donation Donation { get; set; } = null!;
        public Item Item { get; set; } = null!;
    }
}
