using Grpc.Core;

namespace GrpcNotifications.Services
{
    public class NotificationsService : Notifications.NotificationsBase
    {
        private readonly ILogger<NotificationsService> _logger;
        public NotificationsService(ILogger<NotificationsService> logger)
        {
            _logger = logger;
        }

        public override Task<Response> Send(Notification payload, ServerCallContext context)
        {
            _logger.LogDebug(payload.ToString());
            Console.WriteLine(payload.ToString());
            return Task.FromResult(new Response
            {
                Status = "Ok"
            });
        }


    }
}
