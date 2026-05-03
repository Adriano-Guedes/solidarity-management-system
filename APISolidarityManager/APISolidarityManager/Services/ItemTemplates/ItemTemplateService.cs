using APISolidarityManager.Common.Extensions;
using APISolidarityManager.DTOs.ItemTemplates.Requests;
using APISolidarityManager.DTOs.ItemTemplates.Responses;
using APISolidarityManager.Models;
using APISolidarityManager.Repositories.ItemCategories;
using APISolidarityManager.Repositories.ItemTemplates;
using APISolidarityManager.Repositories.NeedGroups;
using APISolidarityManager.Repositories.UnitOfWork;
using AutoMapper;

namespace APISolidarityManager.Services.ItemTemplates
{
    public class ItemTemplateService : IItemTemplateService
    {
        private readonly IItemTemplateRepository _itemTemplateRepository;
        private readonly IItemCategoryRepository _itemCategoryRepository;
        private readonly INeedGroupRepository _needGroupRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public ItemTemplateService(
            IItemTemplateRepository itemTemplateRepository,
            IItemCategoryRepository itemCategoryRepository,
            INeedGroupRepository needGroupRepository,
            IUnitOfWork unitOfWork,
            IMapper mapper)
        {
            _itemTemplateRepository = itemTemplateRepository;
            _itemCategoryRepository = itemCategoryRepository;
            _needGroupRepository = needGroupRepository;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<IEnumerable<ItemTemplateResponse>> GetAllAsync()
        {
            var templates = await _itemTemplateRepository.GetAllWithDetailsAsync();
            return _mapper.Map<IEnumerable<ItemTemplateResponse>>(templates);
        }

        public async Task<IEnumerable<ItemTemplateResponse>> GetAllActiveAsync()
        {
            var templates = (await _itemTemplateRepository.GetAllWithDetailsAsync())
                .Where(t => t.Active);
            return _mapper.Map<IEnumerable<ItemTemplateResponse>>(templates);
        }

        public async Task<ItemTemplateResponse> GetByIdAsync(Guid id)
        {
            var template = await _itemTemplateRepository.GetByIdWithDetailsAsync(id);
            if (template == null) throw new Exception("Template de item não encontrado.");
            return _mapper.Map<ItemTemplateResponse>(template);
        }

        public async Task<ItemTemplateResponse> CreateAsync(CreateItemTemplateRequest request)
        {
            await ValidateCategoryAndGroup(request.CategoryId, request.NeedGroupId);

            var normalizedName = request.Name.NormalizeSpaces();
            var exists = await _itemTemplateRepository.ExistsByNameAndCategoryAsync(normalizedName, request.CategoryId);
            if (exists) throw new Exception("Já existe um template com este nome para a categoria informada.");

            var template = _mapper.Map<ItemTemplate>(request);
            template.Id = Guid.NewGuid();
            template.Name = normalizedName;
            template.CreatedAt = DateTime.UtcNow;

            await _itemTemplateRepository.AddAsync(template);
            await _unitOfWork.SaveChangesAsync();

            var createdTemplate = await _itemTemplateRepository.GetByIdWithDetailsAsync(template.Id);
            return _mapper.Map<ItemTemplateResponse>(createdTemplate);
        }

        public async Task<ItemTemplateResponse> UpdateAsync(Guid id, UpdateItemTemplateRequest request)
        {
            var template = await _itemTemplateRepository.GetByIdAsync(id);
            if (template == null) throw new Exception("Template de item não encontrado.");

            await ValidateCategoryAndGroup(request.CategoryId, request.NeedGroupId);

            var normalizedName = request.Name.NormalizeSpaces();
            var exists = (await _itemTemplateRepository.FindAsync(t => 
                t.Name.ToLower() == normalizedName.ToLower() && 
                t.CategoryId == request.CategoryId && 
                t.Id != id)).Any();
            
            if (exists) throw new Exception("Já existe outro template com este nome para a categoria informada.");

            // Limpa as propriedades de navegação para garantir que o EF atualize as FKs
            template.Category = null!;
            template.NeedGroup = null!;

            _mapper.Map(request, template);
            template.Name = normalizedName;
            template.UpdatedAt = DateTime.UtcNow;

            await _itemTemplateRepository.UpdateAsync(template);
            await _unitOfWork.SaveChangesAsync();

            var updatedTemplate = await _itemTemplateRepository.GetByIdWithDetailsAsync(template.Id);
            return _mapper.Map<ItemTemplateResponse>(updatedTemplate);
        }

        public async Task<ItemTemplateResponse> DeleteAsync(Guid id)
        {
            var template = await _itemTemplateRepository.GetByIdAsync(id);
            if (template == null) throw new Exception("Template de item não encontrado.");

            template.Active = !template.Active;
            template.UpdatedAt = DateTime.UtcNow;

            await _itemTemplateRepository.UpdateAsync(template);
            await _unitOfWork.SaveChangesAsync();

            var deletedTemplate = await _itemTemplateRepository.GetByIdWithDetailsAsync(template.Id);
            return _mapper.Map<ItemTemplateResponse>(deletedTemplate);
        }

        private async Task ValidateCategoryAndGroup(Guid categoryId, Guid needGroupId)
        {
            var category = await _itemCategoryRepository.GetByIdAsync(categoryId);
            if (category == null) throw new Exception("Categoria não encontrada.");

            var group = await _needGroupRepository.GetByIdAsync(needGroupId);
            if (group == null) throw new Exception("Grupo de necessidade não encontrado.");
        }
    }
}
