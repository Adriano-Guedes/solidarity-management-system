using APISolidarityManager.Common.Extensions;
using APISolidarityManager.DTOs.Families.Requests;
using APISolidarityManager.DTOs.Families.Responses;
using APISolidarityManager.DTOs.Items.Responses;
using APISolidarityManager.Models;
using APISolidarityManager.Repositories.Families;
using APISolidarityManager.Repositories.Items;
using APISolidarityManager.Repositories.UnitOfWork;
using AutoMapper;

namespace APISolidarityManager.Services.Families
{
    public class FamilyService : IFamilyService
    {
        private readonly IFamilyRepository _familyRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public FamilyService(
            IFamilyRepository familyRepository,
            IUnitOfWork unitOfWork,
            IMapper mapper)
        {
            _familyRepository = familyRepository;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<IEnumerable<FamilyResponse>> GetAllAsync()
        {
            var families = await _familyRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<FamilyResponse>>(families.OrderBy(f => f.ResponsibleName));
        }

        public async Task<FamilyResponse> GetByIdAsync(Guid id)
        {
            var family = await _familyRepository.GetByIdAsync(id);

            if (family == null)
                throw new Exception("A família informada não foi encontrada.");

            return _mapper.Map<FamilyResponse>(family);
        }

        public async Task<FamilyResponse> CreateAsync(CreateFamilyRequest request)
        {
            var normalizedResponsibleName = request.ResponsibleName.Normalize();
            var normalizedResponsibleDocument = request.ResponsibleDocument.NormalizeNullable();
            var normalizedPhoneNumber = request.PhoneNumber.NormalizeNullable();
            var normalizedAddress = request.Address.NormalizeNullable();
            var normalizedNotes = request.Notes.NormalizeNullable();

            if (!string.IsNullOrWhiteSpace(normalizedResponsibleDocument))
            {
                var familyAlreadyExists = await _familyRepository
                    .ExistsByResponsibleDocumentAsync(normalizedResponsibleDocument);

                if (familyAlreadyExists)
                    throw new Exception("Já existe uma família cadastrada com o documento informado.");
            }

            var family = _mapper.Map<Family>(request);

            family.Id = Guid.NewGuid();
            family.ResponsibleName = normalizedResponsibleName;
            family.ResponsibleDocument = normalizedResponsibleDocument;
            family.PhoneNumber = normalizedPhoneNumber;
            family.Address = normalizedAddress;
            family.Notes = normalizedNotes;
            family.Active = true;
            family.CreatedAt = DateTime.UtcNow;
            family.UpdatedAt = null;

            var createdFamily = await _familyRepository.AddAsync(family);
            await _unitOfWork.SaveChangesAsync();

            return _mapper.Map<FamilyResponse>(createdFamily);
        }

        public async Task<FamilyResponse> UpdateAsync(Guid id, UpdateFamilyRequest request)
        {
            var family = await _familyRepository.GetByIdAsync(id);

            if (family == null)
                throw new Exception("A família informada não foi encontrada.");

            var normalizedResponsibleName = request.ResponsibleName.Normalize();
            var normalizedResponsibleDocument = request.ResponsibleDocument.NormalizeNullable();
            var normalizedPhoneNumber = request.PhoneNumber.NormalizeNullable();
            var normalizedAddress = request.Address.NormalizeNullable();
            var normalizedNotes = request.Notes.NormalizeNullable();

            if (!string.IsNullOrWhiteSpace(normalizedResponsibleDocument))
            {
                var existingFamily = await _familyRepository
                    .GetByResponsibleDocumentAsync(normalizedResponsibleDocument);

                if (existingFamily != null && existingFamily.Id != id)
                    throw new Exception("Já existe uma família cadastrada com o documento informado.");
            }

            _mapper.Map(request, family);

            family.ResponsibleName = normalizedResponsibleName;
            family.ResponsibleDocument = normalizedResponsibleDocument;
            family.PhoneNumber = normalizedPhoneNumber;
            family.Address = normalizedAddress;
            family.Notes = normalizedNotes;
            family.UpdatedAt = DateTime.UtcNow;

            var updatedFamily = await _familyRepository.UpdateAsync(family);
            await _unitOfWork.SaveChangesAsync();

            return _mapper.Map<FamilyResponse>(updatedFamily);
        }

        public async Task<FamilyResponse> UpdateStatusAsync(Guid id)
        {
            var family = await _familyRepository.GetByIdAsync(id);

            if (family == null)
                throw new Exception("A família informada não foi encontrada.");

            family.Active = !family.Active;
            family.UpdatedAt = DateTime.UtcNow;

            var updatedFamily = await _familyRepository.UpdateAsync(family);

            await _unitOfWork.SaveChangesAsync();
            return _mapper.Map<FamilyResponse>(updatedFamily);
        }

        public async Task DeleteAsync(Guid id)
        {
            var family = await _familyRepository.GetByIdAsync(id);

            if (family == null)
                throw new Exception("A família informada não foi encontrada.");

            var removed = await _familyRepository.RemoveAsync(id);

            if (!removed)
                throw new Exception("Não foi possível remover a família.");

            await _unitOfWork.SaveChangesAsync();
        }
    }
}
