using Grpc.Core;
using Notifications.Protos;

namespace Notifications.Services
{
    public class AlertsService: Alerts.AlertsBase
    {
        private readonly ILogger<AlertsService> _logger;
        public AlertsService(ILogger<AlertsService> logger)
        {
            _logger = logger;
        }
        public override Task<Response> Send(Alert request, ServerCallContext context)
        {
            Console.WriteLine("Got new alert: " + request.ToString());
            return Task.FromResult(new Response
            {
                Status = "Ok"
            });
        }
    }
}
