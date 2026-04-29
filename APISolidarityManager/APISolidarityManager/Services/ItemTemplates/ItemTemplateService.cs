using APISolidarityManager.DTOs.ItemCategories.Responses;
using APISolidarityManager.DTOs.ItemTemplates.Responses;
using APISolidarityManager.Repositories.ItemTemplates;
using APISolidarityManager.Services.ItemCategories;
using AutoMapper;

namespace APISolidarityManager.Services.ItemTemplates
{
    public class ItemTemplateService : IItemTemplateService
    {
        private readonly IItemTemplateRepository _itemTemplateRepository;
        private readonly IMapper _mapper;

        public ItemTemplateService(
            IItemTemplateRepository itemTemplateRepository,
            IMapper mapper)
        {
            _itemTemplateRepository = itemTemplateRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<ItemTemplateResponse>> GetAllAsync()
        {
            var templates = await _itemTemplateRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<ItemTemplateResponse>>(templates.OrderBy(c => c.Name));
        }

        public async Task<ItemTemplateResponse> GetByIdAsync(Guid id)
        {
            var itemTemplate = await _itemTemplateRepository.GetByIdAsync(id);

            if (itemTemplate == null)
                throw new Exception("Template de item não encontrado.");

            return _mapper.Map<ItemTemplateResponse>(itemTemplate);
        }
    }
}
