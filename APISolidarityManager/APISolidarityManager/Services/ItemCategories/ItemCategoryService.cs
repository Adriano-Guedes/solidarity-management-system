using APISolidarityManager.Common.Extensions;
using APISolidarityManager.DTOs.ItemCategories.Requests;
using APISolidarityManager.DTOs.ItemCategories.Responses;
using APISolidarityManager.DTOs.Items.Requests;
using APISolidarityManager.DTOs.Items.Responses;
using APISolidarityManager.Models;
using APISolidarityManager.Repositories.ItemCategories;
using APISolidarityManager.Repositories.Items;
using APISolidarityManager.Repositories.UnitOfWork;
using AutoMapper;

namespace APISolidarityManager.Services.ItemCategories
{
    public class ItemCategoryService : IItemCategoryService
    {
        private readonly IItemCategoryRepository _itemCategoryRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public ItemCategoryService(
            IItemCategoryRepository itemCategoryRepository,
            IUnitOfWork unitOfWork,
            IMapper mapper)
        {
            _itemCategoryRepository = itemCategoryRepository;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<IEnumerable<ItemCategoryResponse>> GetAllAsync()
        {
            var categories = await _itemCategoryRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<ItemCategoryResponse>>(categories.OrderBy(c => c.Name));
        }

        public async Task<IEnumerable<ItemCategoryResponse>> GetAllActiveAsync()
        {
            var categories = await _itemCategoryRepository.FindAsync(c => c.Active);
            return _mapper.Map<IEnumerable<ItemCategoryResponse>>(categories.OrderBy(c => c.Name));
        }

        public async Task<ItemCategoryResponse> GetByIdAsync(Guid id)
        {
            var itemCategory = await _itemCategoryRepository.GetByIdAsync(id);

            if (itemCategory == null)
                throw new Exception("Categoria de item não encontrada.");

            return _mapper.Map<ItemCategoryResponse>(itemCategory);
        }

        public async Task<ItemCategoryResponse> CreateAsync(CreateItemCategoryRequest request)
        {
            var normalizedName = request.Name.NormalizeSpaces();

            var categoryAlreadyExists = await _itemCategoryRepository.ExistsByNameAsync(normalizedName);

            if (categoryAlreadyExists)
                throw new Exception("Já existe uma categoria de item com esse nome.");

            var category = _mapper.Map<ItemCategory>(request);

            category.Id = Guid.NewGuid();
            category.Name = normalizedName;
            category.Description = request.Description.NormalizeNullable();
            category.Active = true;
            category.CreatedAt = DateTime.UtcNow;
            category.UpdatedAt = null;

            var createdCategory = await _itemCategoryRepository.AddAsync(category);
            await _unitOfWork.SaveChangesAsync();

            return _mapper.Map<ItemCategoryResponse>(createdCategory);
        }

        public async Task<ItemCategoryResponse> UpdateAsync(Guid id, UpdateItemCategoryRequest request)
        {
            var category = await _itemCategoryRepository.GetByIdAsync(id);

            if (category == null)
                throw new Exception("A categoria de item informada não foi encontrada.");

            var normalizedName = request.Name.NormalizeSpaces();

            var existingCategory = await _itemCategoryRepository.GetByNameAsync(normalizedName);

            if (existingCategory != null && existingCategory.Id != id)
                throw new Exception("Já existe uma categoria de item com esse nome.");

            _mapper.Map(request, category);

            category.Name = normalizedName;
            category.Description = request.Description.NormalizeNullable();
            category.UpdatedAt = DateTime.UtcNow;

            var updatedCategory = await _itemCategoryRepository.UpdateAsync(category);
            await _unitOfWork.SaveChangesAsync();

            return _mapper.Map<ItemCategoryResponse>(updatedCategory);
        }

        public async Task<ItemCategoryResponse> DeleteAsync(Guid id)
        {
            var category = await _itemCategoryRepository.GetByIdAsync(id);

            if (category == null)
                throw new Exception("A categoria de item informada não foi encontrada.");

            category.Active = !category.Active;
            category.UpdatedAt = DateTime.UtcNow;

            var updatedItem = await _itemCategoryRepository.UpdateAsync(category);

            await _unitOfWork.SaveChangesAsync();
            return _mapper.Map<ItemCategoryResponse>(updatedItem);
        }
    }
}
