using APISolidarityManager.DTOs.NeedRules.Requests;
using APISolidarityManager.DTOs.NeedRules.Responses;
using APISolidarityManager.Models;
using APISolidarityManager.Repositories.AgeRanges;
using APISolidarityManager.Repositories.NeedGroups;
using APISolidarityManager.Repositories.NeedRules;
using APISolidarityManager.Repositories.UnitOfWork;
using AutoMapper;

namespace APISolidarityManager.Services.NeedRules
{
    public class NeedRuleService : INeedRuleService
    {
        private readonly INeedRuleRepository _needRuleRepository;
        private readonly IAgeRangeRepository _ageRangeRepository;
        private readonly INeedGroupRepository _needGroupRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public NeedRuleService(
            INeedRuleRepository needRuleRepository,
            IAgeRangeRepository ageRangeRepository,
            INeedGroupRepository needGroupRepository,
            IUnitOfWork unitOfWork,
            IMapper mapper)
        {
            _needRuleRepository = needRuleRepository;
            _ageRangeRepository = ageRangeRepository;
            _needGroupRepository = needGroupRepository;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<IEnumerable<NeedRuleResponse>> GetAllAsync()
        {
            var rules = await _needRuleRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<NeedRuleResponse>>(rules);
        }

        public async Task<IEnumerable<NeedRuleResponse>> GetActiveRulesAsync()
        {
            var rules = await _needRuleRepository.GetActiveRulesAsync();
            return _mapper.Map<IEnumerable<NeedRuleResponse>>(rules);
        }

        public async Task<NeedRuleResponse> GetByIdAsync(Guid id)
        {
            var rule = await _needRuleRepository.GetByIdAsync(id);
            if (rule == null) throw new Exception("Regra não encontrada.");
            return _mapper.Map<NeedRuleResponse>(rule);
        }

        public async Task<NeedRuleResponse> CreateAsync(CreateNeedRuleRequest request)
        {
            await ValidateRangeAndGroup(request.AgeRangeId, request.NeedGroupId);

            var exists = await _needRuleRepository.FindAsync(r => 
                r.AgeRangeId == request.AgeRangeId && 
                r.NeedGroupId == request.NeedGroupId);
            
            if (exists.Any())
                throw new Exception("Já existe uma regra cadastrada para esta faixa etária e grupo de necessidade.");

            var rule = _mapper.Map<NeedRule>(request);
            rule.Id = Guid.NewGuid();
            rule.CreatedAt = DateTime.UtcNow;

            await _needRuleRepository.AddAsync(rule);
            await _unitOfWork.SaveChangesAsync();

            return _mapper.Map<NeedRuleResponse>(rule);
        }

        public async Task<NeedRuleResponse> UpdateAsync(Guid id, UpdateNeedRuleRequest request)
        {
            var rule = await _needRuleRepository.GetByIdAsync(id);
            if (rule == null) throw new Exception("Regra não encontrada.");

            await ValidateRangeAndGroup(request.AgeRangeId, request.NeedGroupId);

            _mapper.Map(request, rule);
            rule.UpdatedAt = DateTime.UtcNow;

            await _needRuleRepository.UpdateAsync(rule);
            await _unitOfWork.SaveChangesAsync();

            return _mapper.Map<NeedRuleResponse>(rule);
        }

        public async Task<NeedRuleResponse> DeleteAsync(Guid id)
        {
            var rule = await _needRuleRepository.GetByIdAsync(id);
            if (rule == null) throw new Exception("Regra não encontrada.");

            await _needRuleRepository.RemoveAsync(id);
            await _unitOfWork.SaveChangesAsync();

            return _mapper.Map<NeedRuleResponse>(rule);
        }

        private async Task ValidateRangeAndGroup(Guid ageRangeId, Guid needGroupId)
        {
            var range = await _ageRangeRepository.GetByIdAsync(ageRangeId);
            if (range == null) throw new Exception("Faixa etária não encontrada.");

            var group = await _needGroupRepository.GetByIdAsync(needGroupId);
            if (group == null) throw new Exception("Grupo de necessidade não encontrado.");
        }
    }
}
