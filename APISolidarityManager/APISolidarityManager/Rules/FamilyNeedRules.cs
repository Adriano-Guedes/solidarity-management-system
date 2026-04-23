namespace APISolidarityManager.Rules
{
    public class FamilyNeedRules
    {
        public static NeedProfile GetProfileByAge(int age)
        {
            if (age < 2)
            {
                return new NeedProfile
                {
                    BaseAlimentar = 0m,
                    Leguminosa = 0m,
                    HigienePessoal = 1.5m,
                    LimpezaBasica = 0.5m
                };
            }

            if (age <= 12)
            {
                return new NeedProfile
                {
                    BaseAlimentar = 0.75m,
                    Leguminosa = 0.75m,
                    HigienePessoal = 1m,
                    LimpezaBasica = 0.5m
                };
            }

            if (age >= 60)
            {
                return new NeedProfile
                {
                    BaseAlimentar = 0.8m,
                    Leguminosa = 0.8m,
                    HigienePessoal = 1m,
                    LimpezaBasica = 0.5m
                };
            }

            return new NeedProfile
            {
                BaseAlimentar = 1m,
                Leguminosa = 1m,
                HigienePessoal = 1m,
                LimpezaBasica = 0.5m
            };
        }
    }
}
