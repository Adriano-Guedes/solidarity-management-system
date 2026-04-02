using System.Text.RegularExpressions;

namespace APISolidarityManager.Common.Extensions
{
    public static class StringExtensions
    {
        public static string NormalizeSpaces(this string value)
        {
            if (string.IsNullOrWhiteSpace(value))
                return string.Empty;

            // Remove espaços no início/fim e normaliza espaços internos
            var normalized = Regex.Replace(value.Trim(), @"\s+", " ");

            return normalized;
        }

        public static string? NormalizeNullable(this string? value)
        {
            if (string.IsNullOrWhiteSpace(value))
                return null;

            var normalized = Regex.Replace(value.Trim(), @"\s+", " ");

            return normalized;
        }
    }
}
