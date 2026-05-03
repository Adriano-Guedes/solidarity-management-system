using APISolidarityManager.DTOs.Deliveries.Responses;
using APISolidarityManager.Models;
using APISolidarityManager.Repositories.Families;
using APISolidarityManager.Repositories.InventoryBatches;
using APISolidarityManager.Repositories.NeedRules;
using APISolidarityManager.Services.Families.FamilyPriority;

namespace APISolidarityManager.Services.Deliveries.DeliverySuggestions
{
    public class DeliverySuggestionService : IDeliverySuggestionService
    {
        private readonly IFamilyRepository _familyRepository;
        private readonly IInventoryBatchRepository _inventoryBatchRepository;
        private readonly IFamilyPriorityService _familyPriorityService;
        private readonly INeedRuleRepository _needRuleRepository;

        private const int UrgencyWindowDays = 15;

        public DeliverySuggestionService(
            IFamilyRepository familyRepository,
            IInventoryBatchRepository inventoryBatchRepository,
            IFamilyPriorityService familyPriorityService,
            INeedRuleRepository needRuleRepository)
        {
            _familyRepository = familyRepository;
            _inventoryBatchRepository = inventoryBatchRepository;
            _familyPriorityService = familyPriorityService;
            _needRuleRepository = needRuleRepository;
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

            var allRules = (await _needRuleRepository.GetActiveRulesAsync()).ToList();
            
            var activeGroups = allRules
                .Select(r => r.NeedGroup)
                .GroupBy(g => g.Id)
                .Select(g => g.First())
                .OrderBy(g => g.Name)
                .ToList();

            var familyNeeds = CalculateFamilyNeeds(activeMembers, allRules);

            var availableBatches = (await _inventoryBatchRepository.GetAvailableBatchesForSuggestionAsync()).ToList();

            var needGroupResults = new List<NeedGroupSuggestionResult>();

            foreach (var group in activeGroups)
            {
                familyNeeds.TryGetValue(group.Id, out decimal neededQuantity);
                
                var result = BuildSuggestionsForNeedGroup(group, neededQuantity, availableBatches);
                needGroupResults.Add(result);
            }

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
                    NeedGroup = x.NeedGroupName,
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

        private Dictionary<Guid, decimal> CalculateFamilyNeeds(List<FamilyMember> activeMembers, List<NeedRule> rules)
        {
            var totalNeeds = new Dictionary<Guid, decimal>();

            foreach (var member in activeMembers)
            {
                var age = member.BirthDate.HasValue
                    ? CalculateAge(member.BirthDate.Value)
                    : 18;

                var memberRules = rules
                    .Where(r => age >= r.AgeRange.MinAge && age <= r.AgeRange.MaxAge)
                    .ToList();

                if (!memberRules.Any())
                {
                    memberRules = rules
                        .Where(r => 18 >= r.AgeRange.MinAge && 18 <= r.AgeRange.MaxAge)
                        .ToList();
                }

                foreach (var rule in memberRules)
                {
                    if (totalNeeds.ContainsKey(rule.NeedGroupId))
                        totalNeeds[rule.NeedGroupId] += rule.Value;
                    else
                        totalNeeds[rule.NeedGroupId] = rule.Value;
                }
            }

            return totalNeeds;
        }

        private NeedGroupSuggestionResult BuildSuggestionsForNeedGroup(NeedGroup group, decimal neededQuantity, List<InventoryBatch> availableBatches)
        {
            var result = new NeedGroupSuggestionResult
            {
                NeedGroupId = group.Id,
                NeedGroupName = group.Name,
                RequiredQuantity = Math.Round(neededQuantity, 2)
            };

            if (neededQuantity <= 0)
            {
                result.FullyMet = true;
                return result;
            }

            var options = availableBatches
                .Where(x =>
                    x.Item.ItemTemplate.NeedGroupId == group.Id &&
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

            while (currentTotalWeight < neededQuantity && options.Any(o => o.TotalUnitsAvailable > 0))
            {
                var remainingNeed = neededQuantity - currentTotalWeight;

                var minDate = options.Where(o => o.TotalUnitsAvailable > 0).Min(o => o.EarliestExpirationDate) ?? DateTime.MaxValue;
                var threshold = minDate == DateTime.MaxValue ? DateTime.MaxValue : minDate.AddDays(UrgencyWindowDays);

                var candidates = options
                    .Where(o => o.TotalUnitsAvailable > 0 && (o.EarliestExpirationDate ?? DateTime.MaxValue) <= threshold)
                    .ToList();

                if (!candidates.Any()) break;

                var bestCandidate = candidates
                    .OrderBy(o => pickedTemplateIds.Contains(o.Item.ItemTemplateId)) 
                    .ThenBy(o => o.Item.TemplateWeight > remainingNeed) 
                    .ThenBy(o => Math.Abs(o.Item.TemplateWeight - remainingNeed)) 
                    .ThenBy(o => o.EarliestExpirationDate ?? DateTime.MaxValue) 
                    .First();

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
                        NeedGroup = group.Name,
                        PackageQuantity = bestCandidate.Item.PackageQuantity,
                        UnitOfMeasure = bestCandidate.Item.UnitOfMeasure,
                        SuggestedUnits = unitsToTake,
                        TotalSuggestedQuantity = weightContribution,
                        Justification = "Otimização de peso e variedade por validade."
                    };
                }

                pickedTemplateIds.Add(bestCandidate.Item.ItemTemplateId);
                currentTotalWeight += weightContribution;

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
            public Guid NeedGroupId { get; set; }
            public string NeedGroupName { get; set; } = null!;
            public decimal RequiredQuantity { get; set; }
            public decimal SuggestedQuantity { get; set; }
            public decimal MissingQuantity { get; set; }
            public bool FullyMet { get; set; }
            public List<DeliverySuggestionItemResponse> Items { get; set; } = new();
        }
    }
}
