using APISolidarityManager.Common.Extensions;
using APISolidarityManager.DTOs.Deliveries.Requests;
using APISolidarityManager.DTOs.Deliveries.Responses;
using APISolidarityManager.Models;
using APISolidarityManager.Repositories.Deliveries;
using APISolidarityManager.Repositories.DeliveryInventoryItems;
using APISolidarityManager.Repositories.Families;
using APISolidarityManager.Repositories.InventoryBatches;
using APISolidarityManager.Repositories.Items;
using APISolidarityManager.Repositories.UnitOfWork;
using APISolidarityManager.Repositories.Users;
using AutoMapper;

namespace APISolidarityManager.Services.Deliveries
{
    public class DeliveryService : IDeliveryService
    {
        private readonly IDeliveryRepository _deliveryRepository;
        private readonly IDeliveryInventoryItemRepository _deliveryInventoryItemRepository;
        private readonly IInventoryBatchRepository _inventoryBatchRepository;
        private readonly IItemRepository _itemRepository;
        private readonly IFamilyRepository _familyRepository;
        private readonly IUserRepository _userRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public DeliveryService(
            IDeliveryRepository deliveryRepository,
            IDeliveryInventoryItemRepository deliveryInventoryItemRepository,
            IInventoryBatchRepository inventoryBatchRepository,
            IItemRepository itemRepository,
            IFamilyRepository familyRepository,
            IUserRepository userRepository,
            IUnitOfWork unitOfWork,
            IMapper mapper)
        {
            _deliveryRepository = deliveryRepository;
            _deliveryInventoryItemRepository = deliveryInventoryItemRepository;
            _inventoryBatchRepository = inventoryBatchRepository;
            _itemRepository = itemRepository;
            _familyRepository = familyRepository;
            _userRepository = userRepository;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<IEnumerable<DeliveryResponse>> GetAllAsync()
        {
            var deliveries = await _deliveryRepository.GetAllWithItemsAsync();
            return _mapper.Map<IEnumerable<DeliveryResponse>>(deliveries);
        }

        public async Task<DeliveryResponse> GetByIdAsync(Guid id)
        {
            var delivery = await _deliveryRepository.GetByIdWithItemsAsync(id);

            if (delivery == null)
                throw new Exception("A entrega informada não foi encontrada.");

            return _mapper.Map<DeliveryResponse>(delivery);
        }

        public async Task<DeliveryResponse> CreateAsync(CreateDeliveryRequest request, Guid createdBy)
        {
            var family = await _familyRepository.GetByIdAsync(request.FamilyId);

            if (family == null)
                throw new Exception("A família informada não foi encontrada.");

            var user = await _userRepository.GetByIdAsync(createdBy);

            if (user == null)
                throw new Exception("O usuário responsável pela criação não foi encontrado.");

            await _unitOfWork.BeginTransactionAsync();

            try
            {
                var delivery = new Delivery
                {
                    Id = Guid.NewGuid(),
                    FamilyId = request.FamilyId,
                    DeliveryDate = request.DeliveryDate,
                    CreatedBy = createdBy,
                    Notes = request.Notes.NormalizeNullable(),
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = null
                };

                var createdDelivery = await _deliveryRepository.AddAsync(delivery);

                foreach (var itemRequest in request.Items)
                {
                    var item = await _itemRepository.GetByIdAsync(itemRequest.ItemId);

                    if (item == null)
                        throw new Exception($"O item informado ({itemRequest.ItemId}) não foi encontrado.");

                    if (itemRequest.Quantity <= 0)
                        throw new Exception("A quantidade do item da entrega deve ser maior que zero.");

                    var availableBatches = (await _inventoryBatchRepository
                        .GetAvailableOrderedByExpirationAsync(itemRequest.ItemId))
                        .ToList();

                    var totalAvailable = availableBatches.Sum(b => b.QuantityAvailable);

                    if (totalAvailable < itemRequest.Quantity)
                        throw new Exception($"Estoque insuficiente para o item {item.Name}.");

                    var remainingQuantity = itemRequest.Quantity;

                    foreach (var batch in availableBatches)
                    {
                        if (remainingQuantity <= 0)
                            break;

                        if (batch.QuantityAvailable <= 0)
                            continue;

                        var quantityToConsume = Math.Min(batch.QuantityAvailable, remainingQuantity);

                        batch.QuantityAvailable -= quantityToConsume;
                        batch.UpdatedAt = DateTime.UtcNow;

                        await _inventoryBatchRepository.UpdateAsync(batch);

                        var deliveryInventoryItem = new DeliveryInventoryItem
                        {
                            DeliveryId = createdDelivery.Id,
                            InventoryBatchId = batch.Id,
                            Quantity = quantityToConsume
                        };

                        await _deliveryInventoryItemRepository.AddAsync(deliveryInventoryItem);

                        remainingQuantity -= quantityToConsume;
                    }
                }

                await _unitOfWork.CommitAsync();

                var savedDelivery = await _deliveryRepository.GetByIdWithItemsAsync(createdDelivery.Id);

                if (savedDelivery == null)
                    throw new Exception("Não foi possível carregar a entrega após a criação.");

                return _mapper.Map<DeliveryResponse>(savedDelivery);
            }
            catch
            {
                await _unitOfWork.RollbackAsync();
                throw;
            }
        }
    }
}
