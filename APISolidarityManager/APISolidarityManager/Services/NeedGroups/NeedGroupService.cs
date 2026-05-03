using APISolidarityManager.Common.Extensions;
using APISolidarityManager.DTOs.NeedGroups.Requests;
using APISolidarityManager.DTOs.NeedGroups.Responses;
using APISolidarityManager.Models;
using APISolidarityManager.Repositories.NeedGroups;
using APISolidarityManager.Repositories.UnitOfWork;
using AutoMapper;

namespace APISolidarityManager.Services.NeedGroups
{
    public class NeedGroupService : INeedGroupService
    {
        private readonly INeedGroupRepository _needGroupRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public NeedGroupService(INeedGroupRepository needGroupRepository, IUnitOfWork unitOfWork, IMapper mapper)
        {
            _needGroupRepository = needGroupRepository;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<IEnumerable<NeedGroupResponse>> GetAllAsync()
        {
            var groups = await _needGroupRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<NeedGroupResponse>>(groups.OrderBy(g => g.Name));
        }

        public async Task<IEnumerable<NeedGroupResponse>> GetAllActiveAsync()
        {
            var groups = await _needGroupRepository.FindAsync(g => g.Active);
            return _mapper.Map<IEnumerable<NeedGroupResponse>>(groups.OrderBy(g => g.Name));
        }

        public async Task<NeedGroupResponse> GetByIdAsync(Guid id)
        {
            var group = await _needGroupRepository.GetByIdAsync(id);
            if (group == null) throw new Exception("Grupo de necessidade não encontrado.");
            return _mapper.Map<NeedGroupResponse>(group);
        }

        public async Task<NeedGroupResponse> CreateAsync(CreateNeedGroupRequest request)
        {
            var normalizedName = request.Name.NormalizeSpaces();
            var exists = await _needGroupRepository.FindAsync(g => g.Name.ToLower() == normalizedName.ToLower());
            if (exists.Any()) throw new Exception("Já existe um grupo de necessidade com este nome.");

            var group = _mapper.Map<NeedGroup>(request);
            group.Id = Guid.NewGuid();
            group.Name = normalizedName;
            group.CreatedAt = DateTime.UtcNow;

            await _needGroupRepository.AddAsync(group);
            await _unitOfWork.SaveChangesAsync();

            return _mapper.Map<NeedGroupResponse>(group);
        }

        public async Task<NeedGroupResponse> UpdateAsync(Guid id, UpdateNeedGroupRequest request)
        {
            var group = await _needGroupRepository.GetByIdAsync(id);
            if (group == null) throw new Exception("Grupo de necessidade não encontrado.");

            var normalizedName = request.Name.NormalizeSpaces();
            var exists = await _needGroupRepository.FindAsync(g => g.Name.ToLower() == normalizedName.ToLower() && g.Id != id);
            if (exists.Any()) throw new Exception("Já existe um grupo de necessidade com este nome.");

            _mapper.Map(request, group);
            group.Name = normalizedName;
            group.UpdatedAt = DateTime.UtcNow;

            await _needGroupRepository.UpdateAsync(group);
            await _unitOfWork.SaveChangesAsync();

            return _mapper.Map<NeedGroupResponse>(group);
        }

        public async Task<NeedGroupResponse> DeleteAsync(Guid id)
        {
            var group = await _needGroupRepository.GetByIdAsync(id);
            if (group == null) throw new Exception("Grupo de necessidade não encontrado.");

            group.Active = !group.Active;
            group.UpdatedAt = DateTime.UtcNow;

            await _needGroupRepository.UpdateAsync(group);
            await _unitOfWork.SaveChangesAsync();

            return _mapper.Map<NeedGroupResponse>(group);
        }
    }
}
