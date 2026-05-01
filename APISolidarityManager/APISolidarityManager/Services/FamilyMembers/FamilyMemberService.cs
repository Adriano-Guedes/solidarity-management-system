using APISolidarityManager.Common.Extensions;
using APISolidarityManager.DTOs.FamilyMembers.Requests;
using APISolidarityManager.DTOs.FamilyMembers.Responses;
using APISolidarityManager.DTOs.Items.Responses;
using APISolidarityManager.Models;
using APISolidarityManager.Repositories.Families;
using APISolidarityManager.Repositories.FamilyMembers;
using APISolidarityManager.Repositories.Items;
using APISolidarityManager.Repositories.UnitOfWork;
using AutoMapper;

namespace APISolidarityManager.Services.FamilyMembers
{
    public class FamilyMemberService : IFamilyMemberService
    {
        private readonly IFamilyMemberRepository _familyMemberRepository;
        private readonly IFamilyRepository _familyRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public FamilyMemberService(
            IFamilyMemberRepository familyMemberRepository,
            IFamilyRepository familyRepository,
            IUnitOfWork unitOfWork,
            IMapper mapper)
        {
            _familyMemberRepository = familyMemberRepository;
            _familyRepository = familyRepository;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<IEnumerable<FamilyMemberResponse>> GetAllByFamilyIdAsync(Guid familyId)
        {
            var family = await _familyRepository.GetByIdAsync(familyId);

            if (family == null)
                throw new Exception("A família informada não foi encontrada.");

            var familyMembers = await _familyMemberRepository.FindAsync(fm => fm.FamilyId == familyId);

            return _mapper.Map<IEnumerable<FamilyMemberResponse>>(familyMembers.OrderBy(fm => fm.Name));
        }

        public async Task<FamilyMemberResponse> GetByIdAsync(Guid familyId, Guid memberId)
        {
            var familyMember = await _familyMemberRepository.GetByIdAsync(memberId);

            if (familyMember == null || familyMember.FamilyId != familyId)
                throw new Exception("Membro da família não encontrado.");

            return _mapper.Map<FamilyMemberResponse>(familyMember);
        }

        public async Task<FamilyMemberResponse> CreateAsync(Guid familyId, CreateFamilyMemberRequest request)
        {
            var family = await _familyRepository.GetByIdAsync(familyId);

            if (family == null)
                throw new Exception("A família informada não foi encontrada.");

            if (request.FamilyId != familyId)
                throw new Exception("O identificador da família da rota difere do corpo da requisição.");

            if (request.IsResponsible)
            {
                var responsibleAlreadyExists = await _familyMemberRepository
                    .FindAsync(fm => fm.FamilyId == familyId && fm.IsResponsible && fm.Active);

                if (responsibleAlreadyExists.Any())
                    throw new Exception("Já existe um responsável ativo cadastrado para esta família.");
            }

            var familyMember = _mapper.Map<FamilyMember>(request);

            familyMember.Id = Guid.NewGuid();
            familyMember.FamilyId = familyId;
            familyMember.Name = request.Name.Normalize();
            familyMember.DocumentNumber = request.DocumentNumber.NormalizeNullable();
            familyMember.Gender = request.Gender.NormalizeNullable();
            familyMember.Relationship = request.Relationship.NormalizeNullable();
            familyMember.Active = true;
            familyMember.CreatedAt = DateTime.UtcNow;
            familyMember.UpdatedAt = null;

            var createdFamilyMember = await _familyMemberRepository.AddAsync(familyMember);
            await _unitOfWork.SaveChangesAsync();

            return _mapper.Map<FamilyMemberResponse>(createdFamilyMember);
        }

        public async Task<FamilyMemberResponse> UpdateAsync(Guid familyId, Guid memberId, UpdateFamilyMemberRequest request)
        {
            var family = await _familyRepository.GetByIdAsync(familyId);

            if (family == null)
                throw new Exception("A família informada não foi encontrada.");

            if (request.FamilyId != familyId)
                throw new Exception("O identificador da família da rota difere do corpo da requisição.");

            var familyMember = await _familyMemberRepository.GetByIdAsync(memberId);

            if (familyMember == null || familyMember.FamilyId != familyId)
                throw new Exception("Membro da família não encontrado.");

            if (request.IsResponsible)
            {
                var responsibleMembers = await _familyMemberRepository.FindAsync(fm =>
                    fm.FamilyId == familyId &&
                    fm.IsResponsible &&
                    fm.Active &&
                    fm.Id != memberId);

                if (responsibleMembers.Any())
                    throw new Exception("Já existe um responsável ativo cadastrado para esta família.");
            }

            _mapper.Map(request, familyMember);

            familyMember.FamilyId = familyId;
            familyMember.Name = request.Name.Normalize();
            familyMember.DocumentNumber = request.DocumentNumber.NormalizeNullable();
            familyMember.Gender = request.Gender.NormalizeNullable();
            familyMember.Relationship = request.Relationship.NormalizeNullable();
            familyMember.UpdatedAt = DateTime.UtcNow;

            var updatedFamilyMember = await _familyMemberRepository.UpdateAsync(familyMember);
            await _unitOfWork.SaveChangesAsync();

            return _mapper.Map<FamilyMemberResponse>(updatedFamilyMember);
        }

        public async Task<FamilyMemberResponse> UpdateStatusAsync(Guid familyId, Guid memberId)
        {
            var familyMember = await _familyMemberRepository.GetByIdAsync(memberId);

            if (familyMember == null || familyMember.FamilyId != familyId)
                throw new Exception("Membro da família não encontrado.");

            familyMember.Active = !familyMember.Active;
            familyMember.UpdatedAt = DateTime.UtcNow;

            var updatedFamilyMember = await _familyMemberRepository.UpdateAsync(familyMember);
            await _unitOfWork.SaveChangesAsync();

            return _mapper.Map<FamilyMemberResponse>(updatedFamilyMember);
        }

        public async Task DeleteAsync(Guid familyId, Guid memberId)
        {
            var familyMember = await _familyMemberRepository.GetByIdAsync(memberId);

            if (familyMember == null || familyMember.FamilyId != familyId)
                throw new Exception("Membro da família não encontrado.");

            familyMember.Active = false;
            familyMember.UpdatedAt = DateTime.UtcNow;

            await _familyMemberRepository.UpdateAsync(familyMember);
            await _unitOfWork.SaveChangesAsync();
        }
    }
}
