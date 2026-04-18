using APISolidarityManager.DTOs.Families.Responses;
using APISolidarityManager.Repositories.Deliveries;
using APISolidarityManager.Repositories.Families;
using APISolidarityManager.Services.Families.FamilyPriority;

namespace APISolidarityManager.Services
{
    public class FamilyPriorityService : IFamilyPriorityService
    {
        private readonly IFamilyRepository _familyRepository;
        private readonly IDeliveryRepository _deliveryRepository;

        public FamilyPriorityService(
            IFamilyRepository familyRepository,
            IDeliveryRepository deliveryRepository)
        {
            _familyRepository = familyRepository;
            _deliveryRepository = deliveryRepository;
        }

        public async Task<FamilyPriorityResponse> GetFamilyPriorityAsync(Guid familyId)
        {
            var family = await _familyRepository.GetByIdWithMembersAsync(familyId);

            if (family is null)
                throw new Exception("Família não encontrada.");

            if (!family.Active)
                throw new Exception("A família informada está inativa.");

            var response = new FamilyPriorityResponse
            {
                FamilyId = family.Id
            };

            var activeMembers = family.FamilyMembers
                .Where(x => x.Active)
                .ToList();

            response.PriorityScore += activeMembers.Count * 2;
            if (activeMembers.Any())
                response.Reasons.Add($"Composição familiar: {activeMembers.Count} membro(s) ativo(s).");

            foreach (var member in activeMembers)
            {
                if (!member.BirthDate.HasValue)
                    continue;

                var age = CalculateAge(member.BirthDate.Value);

                if (age < 2)
                {
                    response.PriorityScore += 4;
                    response.RequiresManualAnalysis = true;
                    response.Reasons.Add($"Membro {member.Name} com menos de 2 anos.");
                }
                else if (age >= 2 && age <= 12)
                {
                    response.PriorityScore += 2;
                    response.Reasons.Add($"Membro {member.Name} é criança entre 2 e 12 anos.");
                }
                else if (age >= 60)
                {
                    response.PriorityScore += 3;
                    response.Reasons.Add($"Membro {member.Name} é idoso.");
                }

                if (member.HasDisability)
                {
                    response.PriorityScore += 4;
                    response.Reasons.Add($"Membro {member.Name} possui deficiência.");
                }

                if (member.HasChronicDisease)
                {
                    response.PriorityScore += 3;
                    response.Reasons.Add($"Membro {member.Name} possui doença crônica.");
                }
            }

            var lastDeliveryDate = await _deliveryRepository.GetLastDeliveryDateByFamilyIdAsync(familyId);

            if (!lastDeliveryDate.HasValue)
            {
                response.PriorityScore += 10;
                response.Reasons.Add("Família sem histórico de entrega.");
            }
            else
            {
                var daysWithoutDelivery = (DateTime.UtcNow.Date - lastDeliveryDate.Value.Date).Days;

                if (daysWithoutDelivery > 90)
                {
                    response.PriorityScore += 8;
                    response.Reasons.Add($"Família sem receber entrega há {daysWithoutDelivery} dias.");
                }
                else if (daysWithoutDelivery > 60)
                {
                    response.PriorityScore += 6;
                    response.Reasons.Add($"Família sem receber entrega há {daysWithoutDelivery} dias.");
                }
                else if (daysWithoutDelivery > 30)
                {
                    response.PriorityScore += 3;
                    response.Reasons.Add($"Família sem receber entrega há {daysWithoutDelivery} dias.");
                }
            }

            response.PriorityLevel = GetPriorityLevel(response.PriorityScore);

            return response;
        }

        private static int CalculateAge(DateTime birthDate)
        {
            var today = DateTime.UtcNow.Date;
            var age = today.Year - birthDate.Year;

            if (birthDate.Date > today.AddYears(-age))
                age--;

            return age;
        }

        private static string GetPriorityLevel(int score)
        {
            if (score >= 25)
                return "Urgente";

            if (score >= 18)
                return "Alta";

            if (score >= 10)
                return "Média";

            return "Baixa";
        }
    }
}