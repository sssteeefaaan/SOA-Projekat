# Generated by the gRPC Python protocol compiler plugin. DO NOT EDIT!
"""Client and server classes corresponding to protobuf-defined services."""
import grpc

import alerts_pb2 as alerts__pb2


class AlertsStub(object):
    """Missing associated documentation comment in .proto file."""

    def __init__(self, channel):
        """Constructor.

        Args:
            channel: A grpc.Channel.
        """
        self.Send = channel.unary_unary(
                '/alerts.Alerts/Send',
                request_serializer=alerts__pb2.Alert.SerializeToString,
                response_deserializer=alerts__pb2.Response.FromString,
                )


class AlertsServicer(object):
    """Missing associated documentation comment in .proto file."""

    def Send(self, request, context):
        """Missing associated documentation comment in .proto file."""
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')


def add_AlertsServicer_to_server(servicer, server):
    rpc_method_handlers = {
            'Send': grpc.unary_unary_rpc_method_handler(
                    servicer.Send,
                    request_deserializer=alerts__pb2.Alert.FromString,
                    response_serializer=alerts__pb2.Response.SerializeToString,
            ),
    }
    generic_handler = grpc.method_handlers_generic_handler(
            'alerts.Alerts', rpc_method_handlers)
    server.add_generic_rpc_handlers((generic_handler,))


 # This class is part of an EXPERIMENTAL API.
class Alerts(object):
    """Missing associated documentation comment in .proto file."""

    @staticmethod
    def Send(request,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            insecure=False,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.unary_unary(request, target, '/alerts.Alerts/Send',
            alerts__pb2.Alert.SerializeToString,
            alerts__pb2.Response.FromString,
            options, channel_credentials,
            insecure, call_credentials, compression, wait_for_ready, timeout, metadata)
