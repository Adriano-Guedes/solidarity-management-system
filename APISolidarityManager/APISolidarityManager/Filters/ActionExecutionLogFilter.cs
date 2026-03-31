using Microsoft.AspNetCore.Mvc.Filters;
using System.Diagnostics;

namespace APISolidarityManager.Filters
{
    public class ActionExecutionLogFilter : IAsyncActionFilter
    {
        private readonly ILogger<ActionExecutionLogFilter> _logger;

        public ActionExecutionLogFilter(ILogger<ActionExecutionLogFilter> logger)
        {
            _logger = logger;
        }

        public async Task OnActionExecutionAsync(
            ActionExecutingContext context,
            ActionExecutionDelegate next)
        {
            var stopwatch = Stopwatch.StartNew();

            var httpMethod = context.HttpContext.Request.Method;
            var route = context.HttpContext.Request.Path;
            var controller = context.RouteData.Values["controller"]?.ToString();
            var action = context.RouteData.Values["action"]?.ToString();

            _logger.LogInformation(
                "Starting action execution. Method: {HttpMethod}, Route: {Route}, Controller: {Controller}, Action: {Action}",
                httpMethod,
                route,
                controller,
                action);

            var executedContext = await next();

            stopwatch.Stop();

            _logger.LogInformation(
                "Finished action execution. Method: {HttpMethod}, Route: {Route}, Controller: {Controller}, Action: {Action}, ElapsedMilliseconds: {ElapsedMilliseconds}",
                httpMethod,
                route,
                controller,
                action,
                stopwatch.ElapsedMilliseconds);

            if (executedContext.Exception != null && !executedContext.ExceptionHandled)
            {
                _logger.LogWarning(
                    executedContext.Exception,
                    "Action finished with unhandled exception. Method: {HttpMethod}, Route: {Route}, Controller: {Controller}, Action: {Action}, ElapsedMilliseconds: {ElapsedMilliseconds}",
                    httpMethod,
                    route,
                    controller,
                    action,
                    stopwatch.ElapsedMilliseconds);
            }
        }
    }
}