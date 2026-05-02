using APISolidarityManager.DTOs.InventoryBatches.Requests;
using APISolidarityManager.DTOs.InventoryBatches.Responses;
using APISolidarityManager.Repositories.InventoryBatches;
using APISolidarityManager.Repositories.Items;
using APISolidarityManager.Repositories.UnitOfWork;
using AutoMapper;

namespace APISolidarityManager.Services.InventoryBatches
{
    public class InventoryBatchService : IInventoryBatchService
    {
        private readonly IInventoryBatchRepository _inventoryBatchRepository;
        private readonly IItemRepository _itemRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public InventoryBatchService(
            IInventoryBatchRepository inventoryBatchRepository,
            IItemRepository itemRepository,
            IUnitOfWork unitOfWork,
            IMapper mapper)
        {
            _inventoryBatchRepository = inventoryBatchRepository;
            _itemRepository = itemRepository;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<IEnumerable<InventoryBatchResponse>> GetAllAsync()
        {
            var inventoryBatches = await _inventoryBatchRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<InventoryBatchResponse>>(inventoryBatches);
        }

        public async Task<InventoryBatchResponse> GetByIdAsync(Guid id)
        {
            var inventoryBatch = await _inventoryBatchRepository.GetByIdAsync(id);

            if (inventoryBatch == null)
                throw new Exception("Lote de estoque não encontrado.");

            return _mapper.Map<InventoryBatchResponse>(inventoryBatch);
        }

        public async Task<IEnumerable<InventoryBatchResponse>> GetByItemIdAsync(Guid itemId)
        {
            var item = await _itemRepository.GetByIdAsync(itemId);

            if (item == null)
                throw new Exception("O item informado não foi encontrado.");

            var inventoryBatches = await _inventoryBatchRepository.GetByItemIdAsync(itemId);

            return _mapper.Map<IEnumerable<InventoryBatchResponse>>(inventoryBatches.OrderBy(x => x.ExpirationDate));
        }

        public async Task<InventoryBatchResponse> UpdateAsync(Guid id, UpdateInventoryBatchRequest request)
        {
            var inventoryBatch = await _inventoryBatchRepository.GetByIdAsync(id);

            if (inventoryBatch == null)
                throw new Exception("O lote de estoque informado não foi encontrado.");

            var hasMovements = await _inventoryBatchRepository.HasMovementsAsync(id);

            if (hasMovements && inventoryBatch.ItemId != request.ItemId)
                throw new Exception("Não é permitido alterar o item de um lote que já possui movimentações.");

            var item = await _itemRepository.GetByIdAsync(request.ItemId);

            if (item == null)
                throw new Exception("O item informado não foi encontrado.");

            if (request.QuantityAvailable < 0)
                throw new Exception("A quantidade disponível não pode ser negativa.");

            _mapper.Map(request, inventoryBatch);

            inventoryBatch.UpdatedAt = DateTime.UtcNow;

            var updatedInventoryBatch = await _inventoryBatchRepository.UpdateAsync(inventoryBatch);
            await _unitOfWork.SaveChangesAsync();

            return _mapper.Map<InventoryBatchResponse>(updatedInventoryBatch);
        }
    }
}
