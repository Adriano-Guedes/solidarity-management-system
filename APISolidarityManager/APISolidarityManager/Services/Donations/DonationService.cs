using APISolidarityManager.Common.Extensions;
using APISolidarityManager.DTOs.Donations.Requests;
using APISolidarityManager.DTOs.Donations.Responses;
using APISolidarityManager.Models;
using APISolidarityManager.Repositories.DonationInventoryItems;
using APISolidarityManager.Repositories.Donations;
using APISolidarityManager.Repositories.InventoryBatches;
using APISolidarityManager.Repositories.Items;
using APISolidarityManager.Repositories.UnitOfWork;
using APISolidarityManager.Repositories.Users;
using AutoMapper;

namespace APISolidarityManager.Services.Donations
{
    public class DonationService : IDonationService
    {
        private readonly IDonationRepository _donationRepository;
        private readonly IDonationInventoryItemRepository _donationInventoryItemRepository;
        private readonly IInventoryBatchRepository _inventoryBatchRepository;
        private readonly IItemRepository _itemRepository;
        private readonly IUserRepository _userRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public DonationService(
            IDonationRepository donationRepository,
            IDonationInventoryItemRepository donationInventoryItemRepository,
            IInventoryBatchRepository inventoryBatchRepository,
            IItemRepository itemRepository,
            IUserRepository userRepository,
            IUnitOfWork unitOfWork,
            IMapper mapper)
        {
            _donationRepository = donationRepository;
            _donationInventoryItemRepository = donationInventoryItemRepository;
            _inventoryBatchRepository = inventoryBatchRepository;
            _itemRepository = itemRepository;
            _userRepository = userRepository;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<IEnumerable<DonationResponse>> GetAllAsync()
        {
            var donations = await _donationRepository.GetAllWithItemsAsync();
            return _mapper.Map<IEnumerable<DonationResponse>>(donations);
        }

        public async Task<DonationResponse> GetByIdAsync(Guid id)
        {
            var donation = await _donationRepository.GetByIdWithItemsAsync(id);

            if (donation == null)
                throw new Exception("A doação informada não foi encontrada.");

            return _mapper.Map<DonationResponse>(donation);
        }

        public async Task<DonationResponse> CreateAsync(CreateDonationRequest request, Guid createdBy)
        {
            var user = await _userRepository.GetByIdAsync(createdBy);

            if (user == null)
                throw new Exception("O usuário responsável pela criação não foi encontrado.");

            await _unitOfWork.BeginTransactionAsync();

            try
            {
                var donation = new Donation
                {
                    Id = Guid.NewGuid(),
                    ReceivedDate = request.ReceivedDate,
                    CreatedBy = createdBy,
                    Notes = request.Notes.NormalizeNullable(),
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = null
                };

                var createdDonation = await _donationRepository.AddAsync(donation);

                foreach (var itemRequest in request.Items)
                {
                    var item = await _itemRepository.GetByIdAsync(itemRequest.ItemId);

                    if (item == null)
                        throw new Exception($"O item informado ({itemRequest.ItemId}) não foi encontrado.");

                    if (itemRequest.Quantity <= 0)
                        throw new Exception("A quantidade do item da doação deve ser maior que zero.");

                    var existingBatch = await _inventoryBatchRepository
                        .GetByItemIdAndExpirationDateAsync(itemRequest.ItemId, itemRequest.ExpirationDate);

                    InventoryBatch batch;

                    if (existingBatch != null)
                    {
                        existingBatch.QuantityAvailable += itemRequest.Quantity;
                        existingBatch.UpdatedAt = DateTime.UtcNow;

                        batch = await _inventoryBatchRepository.UpdateAsync(existingBatch);
                    }
                    else
                    {
                        batch = new InventoryBatch
                        {
                            Id = Guid.NewGuid(),
                            ItemId = itemRequest.ItemId,
                            ExpirationDate = itemRequest.ExpirationDate,
                            QuantityAvailable = itemRequest.Quantity,
                            CreatedAt = DateTime.UtcNow,
                            UpdatedAt = null
                        };

                        batch = await _inventoryBatchRepository.AddAsync(batch);
                    }

                    var donationInventoryItem = new DonationInventoryItem
                    {
                        DonationId = createdDonation.Id,
                        InventoryBatchId = batch.Id,
                        Quantity = itemRequest.Quantity
                    };

                    await _donationInventoryItemRepository.AddAsync(donationInventoryItem);
                }

                await _unitOfWork.CommitAsync();

                var savedDonation = await _donationRepository.GetByIdWithItemsAsync(createdDonation.Id);

                if (savedDonation == null)
                    throw new Exception("Não foi possível carregar a doação após a criação.");

                return _mapper.Map<DonationResponse>(savedDonation);
            }
            catch
            {
                await _unitOfWork.RollbackAsync();
                throw;
            }
        }
    }
}
