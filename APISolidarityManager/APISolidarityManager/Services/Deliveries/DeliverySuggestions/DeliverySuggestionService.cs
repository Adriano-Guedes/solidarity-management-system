using APISolidarityManager.DTOs.Deliveries.Responses;
using APISolidarityManager.Models;
using APISolidarityManager.Repositories.Families;
using APISolidarityManager.Repositories.InventoryBatches;
using APISolidarityManager.Rules;
using APISolidarityManager.Services.Families.FamilyPriority;

namespace APISolidarityManager.Services.Deliveries.DeliverySuggestions
{
    public class DeliverySuggestionService : IDeliverySuggestionService
    {
        private readonly IFamilyRepository _familyRepository;
        private readonly IInventoryBatchRepository _inventoryBatchRepository;
        private readonly IFamilyPriorityService _familyPriorityService;

        private const int UrgencyWindowDays = 30;

        public DeliverySuggestionService(
            IFamilyRepository familyRepository,
            IInventoryBatchRepository inventoryBatchRepository,
            IFamilyPriorityService familyPriorityService)
        {
            _familyRepository = familyRepository;
            _inventoryBatchRepository = inventoryBatchRepository;
            _familyPriorityService = familyPriorityService;
        }

        public async Task<DeliverySuggestionResponse> GetDeliverySuggestionAsync(Guid familyId)
        {
            var family = await _familyRepository.GetByIdWithMembersAsync(familyId);

            if (family is null)
                throw new Exception("Família não encontrada.");

            if (!family.Active)
                throw new Exception("A família informada está inativa.");

            var priority = await _familyPriorityService.GetFamilyPriorityAsync(familyId);

            var activeMembers = family.FamilyMembers
                .Where(x => x.Active)
                .ToList();

            var familyNeeds = CalculateFamilyNeeds(activeMembers);

            var availableBatches = (await _inventoryBatchRepository.GetAvailableBatchesForSuggestionAsync()).ToList();

            var needGroupResults = new List<NeedGroupSuggestionResult>
            {
                BuildSuggestionsForNeedGroup(NeedGroups.BaseAlimentar, familyNeeds.BaseAlimentar, availableBatches),
                BuildSuggestionsForNeedGroup(NeedGroups.Leguminosa, familyNeeds.Leguminosa, availableBatches),
                BuildSuggestionsForNeedGroup(NeedGroups.HigienePessoal, familyNeeds.HigienePessoal, availableBatches),
                BuildSuggestionsForNeedGroup(NeedGroups.LimpezaBasica, familyNeeds.LimpezaBasica, availableBatches)
            };

            return new DeliverySuggestionResponse
            {
                FamilyId = family.Id,
                ResponsibleName = family.ResponsibleName,
                PriorityScore = priority.PriorityScore,
                PriorityLevel = priority.PriorityLevel,
                RequiresManualAnalysis = priority.RequiresManualAnalysis,
                Reasons = priority.Reasons,
                NeedGroupsSummary = needGroupResults.Select(x => new DeliverySuggestionNeedGroupResponse
                {
                    NeedGroup = x.NeedGroup,
                    RequiredQuantity = x.RequiredQuantity,
                    SuggestedQuantity = x.SuggestedQuantity,
                    MissingQuantity = x.MissingQuantity,
                    FullyMet = x.FullyMet
                }).ToList(),
                SuggestedItems = needGroupResults
                    .SelectMany(x => x.Items)
                    .ToList()
            };
        }

        private NeedProfile CalculateFamilyNeeds(List<FamilyMember> activeMembers)
        {
            var totalNeeds = new NeedProfile();

            foreach (var member in activeMembers)
            {
                var age = member.BirthDate.HasValue
                    ? CalculateAge(member.BirthDate.Value)
                    : 18;

                var profile = FamilyNeedRules.GetProfileByAge(age);

                totalNeeds.BaseAlimentar += profile.BaseAlimentar;
                totalNeeds.Leguminosa += profile.Leguminosa;
                totalNeeds.HigienePessoal += profile.HigienePessoal;
                totalNeeds.LimpezaBasica += profile.LimpezaBasica;
            }

            return totalNeeds;
        }

        private NeedGroupSuggestionResult BuildSuggestionsForNeedGroup(string needGroup, decimal neededQuantity, List<InventoryBatch> availableBatches)
        {
            var result = new NeedGroupSuggestionResult
            {
                NeedGroup = needGroup,
                RequiredQuantity = Math.Round(neededQuantity, 2)
            };

            if (neededQuantity <= 0)
            {
                result.FullyMet = true;
                return result;
            }

            var options = availableBatches
                .Where(x =>
                    x.Item.ItemTemplate.NeedGroup == needGroup &&
                    x.QuantityAvailable > 0 &&
                    x.Item.Active &&
                    x.Item.ItemTemplate.Active &&
                    x.Item.ItemTemplate.SuitableForAutoSuggestion)
                .GroupBy(x => x.ItemId)
                .Select(itemGroup => new SuggestionItemOption
                {
                    Item = itemGroup.First().Item,
                    TotalUnitsAvailable = itemGroup.Sum(x => x.QuantityAvailable),
                    EarliestExpirationDate = itemGroup.Min(x => x.ExpirationDate)
                })
                .Where(x => x.TotalUnitsAvailable > 0 && x.Item.TemplateWeight > 0)
                .ToList();

            if (!options.Any())
            {
                result.SuggestedQuantity = 0;
                result.MissingQuantity = result.RequiredQuantity;
                result.FullyMet = false;
                return result;
            }

            decimal currentTotalWeight = 0;
            var selectedItemsMap = new Dictionary<Guid, DeliverySuggestionItemResponse>();
            var pickedTemplateIds = new HashSet<Guid>();

            // Enquanto houver necessidade e estoque
            while (currentTotalWeight < neededQuantity && options.Any(o => o.TotalUnitsAvailable > 0))
            {
                var remainingNeed = neededQuantity - currentTotalWeight;

                // 1. Define a janela de urgência atual
                var minDate = options.Where(o => o.TotalUnitsAvailable > 0).Min(o => o.EarliestExpirationDate) ?? DateTime.MaxValue;
                var threshold = minDate == DateTime.MaxValue ? DateTime.MaxValue : minDate.AddDays(UrgencyWindowDays);

                // 2. Filtra candidatos no "balde" de urgência
                var candidates = options
                    .Where(o => o.TotalUnitsAvailable > 0 && (o.EarliestExpirationDate ?? DateTime.MaxValue) <= threshold)
                    .ToList();

                if (!candidates.Any()) break;

                // 3. Heurística de Escolha: Variedade + Encaixe de Peso
                // Priorizamos:
                // - Templates que ainda não foram escolhidos (Variedade)
                // - Itens que NÃO estouram a meta (Peso <= remainingNeed)
                // - Se todos estouram, o que estoura MENOS (Minimizar sobra)
                var bestCandidate = candidates
                    .OrderBy(o => pickedTemplateIds.Contains(o.Item.ItemTemplateId)) // Variedade primeiro
                    .ThenBy(o => o.Item.TemplateWeight > remainingNeed) // Prefere quem cabe no que falta
                    .ThenBy(o => Math.Abs(o.Item.TemplateWeight - remainingNeed)) // Se couber, o que chega mais perto. Se estourar, o que estoura menos.
                    .ThenBy(o => o.EarliestExpirationDate ?? DateTime.MaxValue) // Desempate por validade
                    .First();

                // 4. Adiciona 1 unidade do melhor candidato
                var unitsToTake = 1; 
                bestCandidate.TotalUnitsAvailable -= unitsToTake;
                var weightContribution = unitsToTake * bestCandidate.Item.TemplateWeight;

                if (selectedItemsMap.TryGetValue(bestCandidate.Item.Id, out var existing))
                {
                    existing.SuggestedUnits += unitsToTake;
                    existing.TotalSuggestedQuantity += weightContribution;
                }
                else
                {
                    selectedItemsMap[bestCandidate.Item.Id] = new DeliverySuggestionItemResponse
                    {
                        ItemId = bestCandidate.Item.Id,
                        ItemName = bestCandidate.Item.Name,
                        NeedGroup = needGroup,
                        PackageQuantity = bestCandidate.Item.PackageQuantity,
                        UnitOfMeasure = bestCandidate.Item.UnitOfMeasure,
                        SuggestedUnits = unitsToTake,
                        TotalSuggestedQuantity = weightContribution,
                        Justification = "Otimização de peso e variedade por validade."
                    };
                }

                pickedTemplateIds.Add(bestCandidate.Item.ItemTemplateId);
                currentTotalWeight += weightContribution;

                // Se já rodamos todos os templates do balde, resetamos o set para permitir repetir na próxima rodada
                if (candidates.All(c => pickedTemplateIds.Contains(c.Item.ItemTemplateId) || c.TotalUnitsAvailable == 0))
                {
                    pickedTemplateIds.Clear();
                }
            }

            result.Items = selectedItemsMap.Values.ToList();
            result.SuggestedQuantity = Math.Round(currentTotalWeight, 2);
            result.MissingQuantity = Math.Round(Math.Max(0, result.RequiredQuantity - currentTotalWeight), 2);
            result.FullyMet = currentTotalWeight >= neededQuantity;

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

        private class SuggestionItemOption
        {
            public Item Item { get; set; } = null!;
            public int TotalUnitsAvailable { get; set; }
            public DateTime? EarliestExpirationDate { get; set; }
        }

        private class NeedGroupSuggestionResult
        {
            public string NeedGroup { get; set; } = null!;
            public decimal RequiredQuantity { get; set; }
            public decimal SuggestedQuantity { get; set; }
            public decimal MissingQuantity { get; set; }
            public bool FullyMet { get; set; }
            public List<DeliverySuggestionItemResponse> Items { get; set; } = new();
        }
    }
}
