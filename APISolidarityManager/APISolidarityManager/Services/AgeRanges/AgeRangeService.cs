using APISolidarityManager.Common.Extensions;
using APISolidarityManager.DTOs.AgeRanges.Requests;
using APISolidarityManager.DTOs.AgeRanges.Responses;
using APISolidarityManager.Models;
using APISolidarityManager.Repositories.AgeRanges;
using APISolidarityManager.Repositories.UnitOfWork;
using AutoMapper;

namespace APISolidarityManager.Services.AgeRanges
{
    public class AgeRangeService : IAgeRangeService
    {
        private readonly IAgeRangeRepository _ageRangeRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public AgeRangeService(IAgeRangeRepository ageRangeRepository, IUnitOfWork unitOfWork, IMapper mapper)
        {
            _ageRangeRepository = ageRangeRepository;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<IEnumerable<AgeRangeResponse>> GetAllAsync()
        {
            var ranges = await _ageRangeRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<AgeRangeResponse>>(ranges.OrderBy(r => r.MinAge));
        }

        public async Task<IEnumerable<AgeRangeResponse>> GetAllActiveAsync()
        {
            var ranges = await _ageRangeRepository.FindAsync(r => r.Active);
            return _mapper.Map<IEnumerable<AgeRangeResponse>>(ranges.OrderBy(r => r.MinAge));
        }

        public async Task<AgeRangeResponse> GetByIdAsync(Guid id)
        {
            var range = await _ageRangeRepository.GetByIdAsync(id);
            if (range == null) throw new Exception("Faixa etária não encontrada.");
            return _mapper.Map<AgeRangeResponse>(range);
        }

        public async Task<AgeRangeResponse> CreateAsync(CreateAgeRangeRequest request)
        {
            await ValidateAgeRange(request.MinAge, request.MaxAge);

            var normalizedName = request.Name.NormalizeSpaces();
            var range = _mapper.Map<AgeRange>(request);
            range.Id = Guid.NewGuid();
            range.Name = normalizedName;
            range.CreatedAt = DateTime.UtcNow;

            await _ageRangeRepository.AddAsync(range);
            await _unitOfWork.SaveChangesAsync();

            return _mapper.Map<AgeRangeResponse>(range);
        }

        public async Task<AgeRangeResponse> UpdateAsync(Guid id, UpdateAgeRangeRequest request)
        {
            var range = await _ageRangeRepository.GetByIdAsync(id);
            if (range == null) throw new Exception("Faixa etária não encontrada.");

            await ValidateAgeRange(request.MinAge, request.MaxAge, id);

            var normalizedName = request.Name.NormalizeSpaces();
            _mapper.Map(request, range);
            range.Name = normalizedName;
            range.UpdatedAt = DateTime.UtcNow;

            await _ageRangeRepository.UpdateAsync(range);
            await _unitOfWork.SaveChangesAsync();

            return _mapper.Map<AgeRangeResponse>(range);
        }

        public async Task<AgeRangeResponse> DeleteAsync(Guid id)
        {
            var range = await _ageRangeRepository.GetByIdAsync(id);
            if (range == null) throw new Exception("Faixa etária não encontrada.");

            range.Active = !range.Active;
            range.UpdatedAt = DateTime.UtcNow;

            await _ageRangeRepository.UpdateAsync(range);
            await _unitOfWork.SaveChangesAsync();

            return _mapper.Map<AgeRangeResponse>(range);
        }

        private async Task ValidateAgeRange(int min, int max, Guid? excludeId = null)
        {
            if (min > max) throw new Exception("A idade mínima não pode ser maior que a idade máxima.");

            var existsOverlap = await _ageRangeRepository.ExistsOverlapAsync(min, max, excludeId);
            if (existsOverlap) throw new Exception("As idades informadas entram em conflito com outra faixa etária já cadastrada.");
        }
    }
}
