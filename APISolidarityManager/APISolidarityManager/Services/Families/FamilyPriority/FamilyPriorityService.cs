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

            result.PriorityScore += 5;
            result.Reasons.Add("Base de cadastro ativo.");

            int memberPoints = Math.Min(activeMembers.Count, 6);
            result.PriorityScore += memberPoints;
            result.Reasons.Add($"Composição familiar: {activeMembers.Count} membro(s) ativo(s).");

            foreach (var member in activeMembers)
            {
                if (member.BirthDate.HasValue)
                {
                    var age = CalculateAge(member.BirthDate.Value);

                    if (age < 2)
                    {
                        result.PriorityScore += 5;
                        result.RequiresManualAnalysis = true;
                        result.Reasons.Add($"Membro {member.Name} com menos de 2 anos (Necessidades especiais).");
                    }
                    else if (age >= 2 && age <= 12)
                    {
                        result.PriorityScore += 3;
                        result.Reasons.Add($"Membro {member.Name} é criança entre 2 e 12 anos.");
                    }
                    else if (age >= 60)
                    {
                        result.PriorityScore += 4;
                        result.Reasons.Add($"Membro {member.Name} é idoso.");
                    }
                }

                if (member.HasDisability)
                {
                    result.PriorityScore += 5;
                    result.Reasons.Add($"Membro {member.Name} possui deficiência.");
                }

                if (member.HasChronicDisease)
                {
                    result.PriorityScore += 4;
                    result.Reasons.Add($"Membro {member.Name} possui doença crônica.");
                }
            }

            if (family.MonthlyIncome.HasValue && activeMembers.Any())
            {
                var perCapita = family.MonthlyIncome.Value / activeMembers.Count;
                if (perCapita <= 218)
                {
                    result.PriorityScore += 10;
                    result.Reasons.Add($"Baixa renda per capita: R$ {perCapita:F2}.");
                }
            }

            if (!lastDeliveryDate.HasValue)
            {
                result.PriorityScore += 100;
                result.Reasons.Add("Família nunca recebeu uma entrega.");
            }
            else
            {
                var daysWithoutDelivery = (DateTime.UtcNow.Date - lastDeliveryDate.Value.Date).Days;

                if (daysWithoutDelivery > 90)
                {
                    result.PriorityScore += 60;
                    result.Reasons.Add($"Família sem receber entrega há {daysWithoutDelivery} dias.");
                }
                else if (daysWithoutDelivery > 60)
                {
                    result.PriorityScore += 40;
                    result.Reasons.Add($"Família sem receber entrega há {daysWithoutDelivery} dias.");
                }
                else if (daysWithoutDelivery > 30)
                {
                    result.PriorityScore += 20;
                    result.Reasons.Add($"Família sem receber entrega há {daysWithoutDelivery} dias.");
                }
                else
                {
                    result.Reasons.Add($"Recebeu entrega recentemente ({daysWithoutDelivery} dias).");
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
            if (score >= 100)
                return "Urgente";

            if (score >= 60)
                return "Alta";

            if (score >= 30)
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