using APISolidarityManager.DTOs.Families.Responses;
using APISolidarityManager.Models;
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

            var lastDeliveryDate = await _deliveryRepository.GetLastDeliveryDateByFamilyIdAsync(familyId);

            var result = CalculatePriority(family, lastDeliveryDate);

            return new FamilyPriorityResponse
            {
                FamilyId = result.FamilyId,
                PriorityScore = result.PriorityScore,
                PriorityLevel = result.PriorityLevel,
                RequiresManualAnalysis = result.RequiresManualAnalysis,
                Reasons = result.Reasons
            };
        }

        public async Task<IEnumerable<FamilyPriorityListItemResponse>> GetPriorityRankingAsync()
        {
            var families = (await _familyRepository.GetAllActiveWithMembersAsync()).ToList();

            var familyIds = families.Select(x => x.Id).ToList();
            var lastDeliveryDates = await _deliveryRepository.GetLastDeliveryDatesByFamilyIdsAsync(familyIds);

            var ranking = families
                .Select(family =>
                {
                    lastDeliveryDates.TryGetValue(family.Id, out var lastDeliveryDate);

                    var result = CalculatePriority(family, lastDeliveryDate);

                    return new FamilyPriorityListItemResponse
                    {
                        FamilyId = result.FamilyId,
                        ResponsibleName = family.ResponsibleName,
                        PriorityScore = result.PriorityScore,
                        PriorityLevel = result.PriorityLevel,
                        RequiresManualAnalysis = result.RequiresManualAnalysis,
                        Reasons = result.Reasons,
                        LastDeliveryDate = lastDeliveryDate
                    };
                })
                .OrderByDescending(x => x.PriorityScore)
                .ThenBy(x => x.LastDeliveryDate ?? DateTime.MinValue)
                .ThenBy(x => x.ResponsibleName)
                .ToList();

            return ranking;
        }

        private FamilyPriorityCalculationResult CalculatePriority(Family family, DateTime? lastDeliveryDate)
        {
            var result = new FamilyPriorityCalculationResult
            {
                FamilyId = family.Id
            };

            var activeMembers = family.FamilyMembers
                .Where(x => x.Active)
                .ToList();

            result.PriorityScore += activeMembers.Count * 2;

            if (activeMembers.Any())
                result.Reasons.Add($"Composição familiar: {activeMembers.Count} membro(s) ativo(s).");

            foreach (var member in activeMembers)
            {
                if (member.BirthDate.HasValue)
                {
                    var age = CalculateAge(member.BirthDate.Value);

                    if (age < 2)
                    {
                        result.PriorityScore += 4;
                        result.RequiresManualAnalysis = true;
                        result.Reasons.Add($"Membro {member.Name} com menos de 2 anos.");
                    }
                    else if (age >= 2 && age <= 12)
                    {
                        result.PriorityScore += 2;
                        result.Reasons.Add($"Membro {member.Name} é criança entre 2 e 12 anos.");
                    }
                    else if (age >= 60)
                    {
                        result.PriorityScore += 3;
                        result.Reasons.Add($"Membro {member.Name} é idoso.");
                    }
                }

                if (member.HasDisability)
                {
                    result.PriorityScore += 4;
                    result.Reasons.Add($"Membro {member.Name} possui deficiência.");
                }

                if (member.HasChronicDisease)
                {
                    result.PriorityScore += 3;
                    result.Reasons.Add($"Membro {member.Name} possui doença crônica.");
                }
            }

            if (!lastDeliveryDate.HasValue)
            {
                result.PriorityScore += 10;
                result.Reasons.Add("Família sem histórico de entrega.");
            }
            else
            {
                var daysWithoutDelivery = (DateTime.UtcNow.Date - lastDeliveryDate.Value.Date).Days;

                if (daysWithoutDelivery > 90)
                {
                    result.PriorityScore += 8;
                    result.Reasons.Add($"Família sem receber entrega há {daysWithoutDelivery} dias.");
                }
                else if (daysWithoutDelivery > 60)
                {
                    result.PriorityScore += 6;
                    result.Reasons.Add($"Família sem receber entrega há {daysWithoutDelivery} dias.");
                }
                else if (daysWithoutDelivery > 30)
                {
                    result.PriorityScore += 3;
                    result.Reasons.Add($"Família sem receber entrega há {daysWithoutDelivery} dias.");
                }
            }

            result.PriorityLevel = GetPriorityLevel(result.PriorityScore);

            return result;
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

        private class FamilyPriorityCalculationResult
        {
            public Guid FamilyId { get; set; }
            public int PriorityScore { get; set; }
            public string PriorityLevel { get; set; } = null!;
            public bool RequiresManualAnalysis { get; set; }
            public List<string> Reasons { get; set; } = new();
        }
    }
}