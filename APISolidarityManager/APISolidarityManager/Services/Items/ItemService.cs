using APISolidarityManager.Common.Extensions;
using APISolidarityManager.Context;
using APISolidarityManager.DTOs.Items.Requests;
using APISolidarityManager.DTOs.Items.Responses;
using APISolidarityManager.Models;
using APISolidarityManager.Repositories.ItemCategories;
using APISolidarityManager.Repositories.Items;
using APISolidarityManager.Repositories.ItemTemplates;
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
        private readonly IItemTemplateRepository _itemTemplateRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public ItemService(
            IItemRepository itemRepository, 
            IItemCategoryRepository itemCategoryRepository,
            IItemTemplateRepository itemTemplateRepository, 
            IUnitOfWork unitOfWork, 
            IMapper mapper)
        {
            _itemRepository = itemRepository;
            _itemCategoryRepository = itemCategoryRepository;
            _itemTemplateRepository = itemTemplateRepository;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<IEnumerable<ItemResponse>> GetAllAsync()
        {
            try
            {
                var items = await _itemRepository.GetAllAsync();
                return _mapper.Map<IEnumerable<ItemResponse>>(items.OrderBy(i => i.Name));
            }
            catch (Exception ex)
            {
                throw new Exception("Ocorreu um erro ao buscar os itens.", ex);
            }
        }

        public async Task<IEnumerable<ItemResponse>> GetAllActiveAsync()
        {
            try
            {
                var items = await _itemRepository.FindAsync(p => p.Active == true);
                return _mapper.Map<IEnumerable<ItemResponse>>(items.OrderBy(i => i.Name));
            }
            catch (Exception ex)
            {
                throw new Exception("Ocorreu um erro ao buscar os itens.", ex);
            }
        }

        public async Task<IEnumerable<ItemResponse>> GetAllByCategoryAsync(Guid categoryId)
        {
            try
            {
                var items = await _itemRepository.FindAsync(p => p.CategoryId == categoryId);
                return _mapper.Map<IEnumerable<ItemResponse>>(items.OrderBy(i => i.Name));
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
            await ValidateCategoryAndTemplateAsync(request.CategoryId, request.ItemTemplateId);

            var normalizedName = request.Name.NormalizeSpaces();

            var itemAlreadyExists = await _itemRepository.ExistsByNameAndCategoryAsync(normalizedName, request.CategoryId);

            if (itemAlreadyExists)
                throw new Exception("Já existe um item com esse nome para a categoria informada.");

            var item = _mapper.Map<Item>(request);

            item.Id = Guid.NewGuid();
            item.Name = normalizedName;
            item.Brand = request.Brand.NormalizeNullable();
            item.UnitOfMeasure = request.UnitOfMeasure.NormalizeNullable();
            item.Notes = request.Notes.NormalizeNullable();
            item.Active = request.Active;
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

            await ValidateCategoryAndTemplateAsync(request.CategoryId, request.ItemTemplateId);

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

        public async Task<ItemResponse> DeleteAsync(Guid id)
        {
            var item = await _itemRepository.GetByIdAsync(id);

            if (item == null)
                throw new Exception("O item informado não foi encontrado.");

            item.Active = !item.Active;
            item.UpdatedAt = DateTime.UtcNow;

            var updatedItem = await _itemRepository.UpdateAsync(item);

            await _unitOfWork.SaveChangesAsync();
            return _mapper.Map<ItemResponse>(updatedItem);
        }

        #region Métodos Privados
        private async Task ValidateCategoryAndTemplateAsync(Guid categoryId, Guid itemTemplateId)
        {
            var category = await _itemCategoryRepository.GetByIdAsync(categoryId);
            if (category is null)
                throw new Exception("Categoria do item não encontrada.");

            if (!category.Active)
                throw new Exception("A categoria informada está inativa.");

            var itemTemplate = await _itemTemplateRepository.GetByIdAsync(itemTemplateId);
            if (itemTemplate is null)
                throw new Exception("Template do item não encontrado.");

            if (!itemTemplate.Active)
                throw new Exception("O template informado está inativo.");

            if (itemTemplate.CategoryId != categoryId)
                throw new Exception("O template informado não pertence à categoria selecionada para o item.");
        }
        #endregion
    }
}
