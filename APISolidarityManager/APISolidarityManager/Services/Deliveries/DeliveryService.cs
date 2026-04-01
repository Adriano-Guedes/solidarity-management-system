using APISolidarityManager.Repositories.Deliveries;
using APISolidarityManager.Repositories.Items;

namespace APISolidarityManager.Services.Deliveries
{
    public class DeliveryService : IDeliveryService
    {
        private readonly IDeliveryRepository _deliveryRepository;

        public DeliveryService(IDeliveryRepository deliveryRepository)
        {
            _deliveryRepository = deliveryRepository;
        }
    }
}
