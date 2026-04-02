namespace APISolidarityManager.Common.Extensions
{
    public static class DateTimeExtensions
    {
        private static readonly TimeZoneInfo SaoPauloTimeZone =
            TimeZoneInfo.FindSystemTimeZoneById("E. South America Standard Time");

        public static DateTime ToSaoPauloTime(this DateTime utcDateTime)
        {
            if (utcDateTime.Kind == DateTimeKind.Unspecified)
                utcDateTime = DateTime.SpecifyKind(utcDateTime, DateTimeKind.Utc);

            return TimeZoneInfo.ConvertTimeFromUtc(utcDateTime, SaoPauloTimeZone);
        }

        public static DateTime? ToSaoPauloTime(this DateTime? utcDateTime)
        {
            if (!utcDateTime.HasValue)
                return null;

            var value = utcDateTime.Value;

            if (value.Kind == DateTimeKind.Unspecified)
                value = DateTime.SpecifyKind(value, DateTimeKind.Utc);

            return TimeZoneInfo.ConvertTimeFromUtc(value, SaoPauloTimeZone);
        }
    }
}
