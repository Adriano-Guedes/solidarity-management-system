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

        // NOVA VERSÃO: Busca combinação ótima usando todos os itens do grupo
        private NeedGroupSuggestionResult BuildSuggestionsForNeedGroup(string needGroup, decimal neededQuantity, List<InventoryBatch> availableBatches)
        {
            var result = new NeedGroupSuggestionResult
            {
                NeedGroup = needGroup,
                RequiredQuantity = neededQuantity
            };

            if (neededQuantity <= 0)
            {
                result.FullyMet = true;
                return result;
            }

            // Agrupa todos os itens disponíveis do grupo
            var groupItems = availableBatches
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
                .Where(x => x.TotalUnitsAvailable > 0 && x.Item.PackageQuantity > 0)
                .OrderBy(x => x.EarliestExpirationDate ?? DateTime.MaxValue)
                .ThenByDescending(x => x.Item.PackageQuantity)
                .ToList();

            if (!groupItems.Any())
            {
                result.SuggestedQuantity = 0;
                result.MissingQuantity = neededQuantity;
                result.FullyMet = false;
                return result;
            }

            // Busca a melhor combinação usando todos os itens do grupo
            var bestCombination = FindBestCombination(groupItems, neededQuantity);

            if (bestCombination is not null)
            {
                result.Items = MapCombinationToSuggestionItems(
                    bestCombination,
                    needGroup,
                    "Sugestão otimizada considerando todos os itens disponíveis do grupo.");
                result.SuggestedQuantity = result.Items.Sum(x => x.TotalSuggestedQuantity);
                result.MissingQuantity = Math.Max(0, neededQuantity - result.SuggestedQuantity);
                result.FullyMet = result.SuggestedQuantity >= neededQuantity;
            }
            else
            {
                result.SuggestedQuantity = 0;
                result.MissingQuantity = neededQuantity;
                result.FullyMet = false;
            }

            return result;
        }

        private SuggestionCombinationResult? FindBestCombination(List<SuggestionItemOption> options, decimal neededQuantity)
        {
            SuggestionCombinationResult? bestResult = null;

            void Search(int index, decimal currentTotal, int currentVolumeCount, List<SuggestionSelectedItem> currentItems)
            {
                if (currentTotal >= neededQuantity)
                {
                    var candidate = new SuggestionCombinationResult
                    {
                        TotalQuantity = currentTotal,
                        VolumeCount = currentVolumeCount,
                        Items = currentItems
                            .Where(x => x.SuggestedUnits > 0)
                            .Select(x => new SuggestionSelectedItem
                            {
                                Option = x.Option,
                                SuggestedUnits = x.SuggestedUnits
                            })
                            .ToList()
                    };

                    if (IsBetterCombination(candidate, bestResult, neededQuantity))
                        bestResult = candidate;

                    return;
                }

                if (index >= options.Count)
                    return;

                var option = options[index];

                for (int units = 0; units <= option.TotalUnitsAvailable; units++)
                {
                    var addedQuantity = units * option.Item.PackageQuantity;
                    var nextTotal = currentTotal + addedQuantity;
                    var nextVolumeCount = currentVolumeCount + units;

                    currentItems.Add(new SuggestionSelectedItem
                    {
                        Option = option,
                        SuggestedUnits = units
                    });

                    Search(index + 1, nextTotal, nextVolumeCount, currentItems);

                    currentItems.RemoveAt(currentItems.Count - 1);
                }
            }

            Search(0, 0m, 0, new List<SuggestionSelectedItem>());

            return bestResult;
        }

        private bool IsBetterCombination(SuggestionCombinationResult candidate, SuggestionCombinationResult? currentBest, decimal neededQuantity)
        {
            if (currentBest is null)
                return true;

            var candidateLeftover = candidate.TotalQuantity - neededQuantity;
            var currentLeftover = currentBest.TotalQuantity - neededQuantity;

            if (candidateLeftover < currentLeftover)
                return true;

            if (candidateLeftover > currentLeftover)
                return false;

            if (candidate.VolumeCount < currentBest.VolumeCount)
                return true;

            if (candidate.VolumeCount > currentBest.VolumeCount)
                return false;

            var candidateEarliestExpiration = candidate.Items
                .Select(x => x.Option.EarliestExpirationDate ?? DateTime.MaxValue)
                .DefaultIfEmpty(DateTime.MaxValue)
                .Min();

            var currentEarliestExpiration = currentBest.Items
                .Select(x => x.Option.EarliestExpirationDate ?? DateTime.MaxValue)
                .DefaultIfEmpty(DateTime.MaxValue)
                .Min();

            if (candidateEarliestExpiration < currentEarliestExpiration)
                return true;

            if (candidateEarliestExpiration > currentEarliestExpiration)
                return false;

            var candidateLargestPackage = candidate.Items
                .Select(x => x.Option.Item.PackageQuantity)
                .DefaultIfEmpty(0m)
                .Max();

            var currentLargestPackage = currentBest.Items
                .Select(x => x.Option.Item.PackageQuantity)
                .DefaultIfEmpty(0m)
                .Max();

            return candidateLargestPackage > currentLargestPackage;
        }

        private List<DeliverySuggestionItemResponse> MapCombinationToSuggestionItems(SuggestionCombinationResult combination, string needGroup, string justification)
        {
            return combination.Items
                .Where(x => x.SuggestedUnits > 0)
                .Select(selected => new DeliverySuggestionItemResponse
                {
                    ItemId = selected.Option.Item.Id,
                    ItemName = selected.Option.Item.Name,
                    NeedGroup = needGroup,
                    PackageQuantity = selected.Option.Item.PackageQuantity,
                    UnitOfMeasure = selected.Option.Item.UnitOfMeasure,
                    SuggestedUnits = selected.SuggestedUnits,
                    TotalSuggestedQuantity = selected.SuggestedUnits * selected.Option.Item.PackageQuantity,
                    Justification = justification
                })
                .ToList();
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

        private class SuggestionSelectedItem
        {
            public SuggestionItemOption Option { get; set; } = null!;
            public int SuggestedUnits { get; set; }
        }

        private class SuggestionCombinationResult
        {
            public decimal TotalQuantity { get; set; }
            public int VolumeCount { get; set; }
            public List<SuggestionSelectedItem> Items { get; set; } = new();
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
