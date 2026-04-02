using APISolidarityManager.Common.Extensions;
using APISolidarityManager.Context;
using APISolidarityManager.DTOs.Items.Requests;
using APISolidarityManager.DTOs.Items.Responses;
using APISolidarityManager.Models;
using APISolidarityManager.Repositories.ItemCategories;
using APISolidarityManager.Repositories.Items;
using APISolidarityManager.Repositories.UnitOfWork;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using System.Collections;

namespace APISolidarityManager.Services.Items
{
    public class ItemService : IItemService
    {
        private readonly IItemRepository _itemRepository;
        private readonly IItemCategoryRepository _itemCategoryRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public ItemService(IItemRepository itemRepository, IItemCategoryRepository itemCategoryRepository, IUnitOfWork unitOfWork, IMapper mapper)
        {
            _itemRepository = itemRepository;
            _itemCategoryRepository = itemCategoryRepository;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<IEnumerable<ItemResponse>> GetAllAsync()
        {
            try
            {
                var items = await _itemRepository.GetAllAsync();
                return _mapper.Map<IEnumerable<ItemResponse>>(items);
            }
            catch (Exception ex)
            {
                throw new Exception("Ocorreu um erro ao buscar os itens.", ex);
            }
        }

        public async Task<ItemResponse> GetByIdAsync(Guid id)
        {
            var item = await _itemRepository.GetByIdAsync(id);

            if (item == null)
                throw new Exception("O item informado não foi encontrado.");

            return _mapper.Map<ItemResponse>(item);
        }

        public async Task<ItemResponse> CreateAsync(CreateItemRequest request)
        {
            var category = await _itemCategoryRepository.GetByIdAsync(request.CategoryId);

            if (category == null)
                throw new Exception("A categoria informada não foi encontrada.");

            var normalizedName = request.Name.NormalizeSpaces();

            var itemAlreadyExists = await _itemRepository
                .ExistsByNameAndCategoryAsync(normalizedName, request.CategoryId);

            if (itemAlreadyExists)
                throw new Exception("Já existe um item com esse nome para a categoria informada.");

            var item = _mapper.Map<Item>(request);

            item.Id = Guid.NewGuid();
            item.Name = normalizedName;
            item.Brand = request.Brand.NormalizeNullable();
            item.UnitOfMeasure = request.UnitOfMeasure.NormalizeNullable();
            item.Notes = request.Notes.NormalizeNullable();
            item.Active = true;
            item.CreatedAt = DateTime.UtcNow;
            item.UpdatedAt = null;

            var createdItem = await _itemRepository.AddAsync(item);
            await _unitOfWork.SaveChangesAsync();

            return _mapper.Map<ItemResponse>(createdItem);
        }

        public async Task<ItemResponse> UpdateAsync(Guid id, UpdateItemRequest request)
        {
            var item = await _itemRepository.GetByIdAsync(id);

            if (item == null)
                throw new Exception("O item informado não foi encontrado.");

            var category = await _itemCategoryRepository.GetByIdAsync(request.CategoryId);

            if (category == null)
                throw new Exception("A categoria informada não foi encontrada.");

            var normalizedName = request.Name.NormalizeSpaces();

            var existingItem = await _itemRepository.GetByNameAndCategoryAsync(normalizedName, request.CategoryId);

            if (existingItem != null && existingItem.Id != id)
                throw new Exception("Já existe um item com esse nome para a categoria informada.");

            _mapper.Map(request, item);

            item.Name = normalizedName;
            item.Brand = request.Brand.NormalizeNullable();
            item.UnitOfMeasure = request.UnitOfMeasure.NormalizeNullable();
            item.Notes = request.Notes.NormalizeNullable();
            item.UpdatedAt = DateTime.UtcNow;

            var updatedItem = await _itemRepository.UpdateAsync(item);
            await _unitOfWork.SaveChangesAsync();

            return _mapper.Map<ItemResponse>(updatedItem);
        }

        public async Task DeleteAsync(Guid id)
        {
            var item = await _itemRepository.GetByIdAsync(id);

            if (item == null)
                throw new Exception("O item informado não foi encontrado.");

            var removed = await _itemRepository.RemoveAsync(id);

            if (!removed)
                throw new Exception("Não foi possível remover o item.");

            await _unitOfWork.SaveChangesAsync();
        }
    }
}
